import { PLATFORM_MAP } from "@/types/dashboard/provider";
import type { TIntegrationProvider } from "@/types/integration/platformConnection";
import type {
  IGoogleSyncData,
  IMetaSyncData,
  INaverSyncData,
} from "@/types/integration/platformSync";

/** 오늘 기준 yyyy-MM-dd */
function toDateString(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Naver sync 모달 기본값: 최근 30일 */
export function getDefaultNaverSyncDateRange(): {
  startDate: string;
  endDate: string;
} {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 29);

  return {
    startDate: toDateString(start),
    endDate: toDateString(end),
  };
}

type TSyncResult = IMetaSyncData | INaverSyncData;

function hasPartialFailure(data: TSyncResult): boolean {
  if ("failedAccountIds" in data) {
    return data.failedAccountIds.length > 0;
  }
  return data.failedConnectionIds.length > 0;
}

function getFailedCount(data: TSyncResult): number {
  if ("failedAccountIds" in data) {
    return data.failedAccountIds.length;
  }
  return data.failedConnectionIds.length;
}

export function getPlatformSyncToast(
  provider: TIntegrationProvider,
  data: TSyncResult | IGoogleSyncData,
): { type: "success" | "warning"; message: string } {
  const label = PLATFORM_MAP[provider] ?? provider;

  if ("message" in data) {
    return {
      type: "success",
      message: data.message || `${label} 데이터를 동기화했습니다.`,
    };
  }

  if (hasPartialFailure(data)) {
    return {
      type: "warning",
      message: `${label} 동기화는 완료됐지만 일부 계정에서 실패했습니다. (${getFailedCount(data)}건)`,
    };
  }

  return {
    type: "success",
    message: `${label} 데이터를 동기화했습니다.`,
  };
}
