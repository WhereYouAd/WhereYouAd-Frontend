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

function parseDate(value: string): Date | null {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function isTokenExpired(tokenExpireAt?: string): boolean {
  if (!tokenExpireAt) return false;
  const expire = parseDate(tokenExpireAt);
  if (!expire) return false;
  return startOfDay(expire).getTime() < startOfDay(new Date()).getTime();
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
  if (account.status === "EXPIRED" || isTokenExpired(account.tokenExpireAt)) {
    return "error";
  }
  if (account.status === "ACTIVE") {
    return "connected";
  }
  return "disconnected";
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
    tokenExpireAt: account.tokenExpireAt,
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
