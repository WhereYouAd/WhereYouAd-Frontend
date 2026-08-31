import type {
  IPlatformAccountApi,
  IPlatformConnectionItem,
  TIntegrationProvider,
  TPlatformConnectionStatus,
} from "@/types/integration/platformConnection";

const INTEGRATION_PROVIDERS: TIntegrationProvider[] = [
  "META",
  "GOOGLE",
  "NAVER",
];

const TOKEN_EXPIRE_WARNING_DAYS = 7;
const DATE_ONLY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

/** date-only(YYYY-MM-DD)는 UTC가 아닌 로컬 달력 날짜로 파싱 */
function parseDate(value: string): Date | null {
  const dateOnly = DATE_ONLY_PATTERN.exec(value);
  if (dateOnly) {
    const year = Number(dateOnly[1]);
    const month = Number(dateOnly[2]);
    const day = Number(dateOnly[3]);
    const date = new Date(year, month - 1, day);
    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      return null;
    }
    return date;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function isTokenExpired(tokenExpireAt?: string): boolean {
  if (!tokenExpireAt) return false;
  const trimmed = tokenExpireAt.trim();
  const expire = parseDate(trimmed);
  if (!expire) return false;

  // date-only(YYYY-MM-DD): 로컬 달력 기준 — 만료일 당일부터 만료로 봄
  // (ex. tokenExpireAt "2026-08-08", 오늘이 8일 -> 재연동 필요)
  if (DATE_ONLY_PATTERN.test(trimmed)) {
    return startOfDay(expire).getTime() <= startOfDay(new Date()).getTime();
  }

  // datetime(ISO 등): UTC 날짜 문자열만 보면 전날처럼 보여도 KST로는 오늘 0시인 경우가 있음
  // → 달력이 아니라 실제 만료 시각과 현재 시각을 비교
  return expire.getTime() < Date.now();
}

export function isTokenExpiringSoon(tokenExpireAt?: string): boolean {
  if (!tokenExpireAt || isTokenExpired(tokenExpireAt)) return false;
  const expire = parseDate(tokenExpireAt);
  if (!expire) return false;
  const diffMs =
    startOfDay(expire).getTime() - startOfDay(new Date()).getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays <= TOKEN_EXPIRE_WARNING_DAYS;
}

export type TTokenExpireTone = "default" | "warning" | "expired";

export function getTokenExpireTone(tokenExpireAt?: string): TTokenExpireTone {
  if (!tokenExpireAt) return "default";
  if (isTokenExpired(tokenExpireAt)) return "expired";
  if (isTokenExpiringSoon(tokenExpireAt)) return "warning";
  return "default";
}

export function formatConnectionDateTime(value?: string): string | null {
  if (!value) return null;
  const date = parseDate(value);
  if (!date) return value;
  if (value.includes("T")) {
    return date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export function formatConnectionDate(value?: string): string | null {
  if (!value) return null;
  const date = parseDate(value);
  if (!date) return value;
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

function mapApiStatusToUi(
  account: IPlatformAccountApi,
): TPlatformConnectionStatus {
  // 구글: tokenExpireAt은 단기 액세스 토큰 만료라 연동 수명과 무관 → status만 신뢰
  const isExpiredByToken =
    account.provider !== "GOOGLE" && isTokenExpired(account.tokenExpireAt);

  if (account.status === "EXPIRED" || isExpiredByToken) {
    return "error";
  }
  if (account.status === "ACTIVE") {
    return "connected";
  }
  return "disconnected"; // DISCONNECTED, INACTIVE 포함
}

function mapAccountToConnection(
  account: IPlatformAccountApi,
): IPlatformConnectionItem {
  const status = mapApiStatusToUi(account);
  const base: IPlatformConnectionItem = {
    provider: account.provider,
    status,
    platformAccountId: account.platformAccountId,
    externalAccountId: account.externalAccountId,
    syncedAt: account.syncedAt,
    // 구글은 만료 UI/판정에 쓰지 않음 (메타,네이버만 전달)
    ...(account.provider !== "GOOGLE" && {
      tokenExpireAt: account.tokenExpireAt,
    }),
  };

  if (status === "error") {
    return {
      ...base,
      errorMessage: "토큰이 만료되었습니다. 다시 연동해 주세요.",
    };
  }

  return base;
}

export function mapPlatformAccountsToConnections(
  accounts: IPlatformAccountApi[],
): IPlatformConnectionItem[] {
  return INTEGRATION_PROVIDERS.map((provider) => {
    const account = accounts.find((item) => item.provider === provider);
    if (!account) {
      return { provider, status: "disconnected" };
    }
    return mapAccountToConnection(account);
  });
}
