import type { IBudgetResponse, IMetricsResponse, IRoasRanking } from "./common";

export type { IBudgetResponse, IMetricsResponse, IRoasRanking };
export type { TProviderType } from "./provider";

// ROAS 순위 조회 요청 파라미터
export interface IRoasRankingsParams {
  startDate?: string;
  endDate?: string;
}

// ROAS 순위 조회 응답
export interface IRoasRankingsResponse {
  startDate: string;
  endDate: string;
  rankings: IRoasRanking[];
}

// 플랫폼별 ROAS 순위 + 지표(CTR/CVR) 통합 항목
export interface IPlatformRankingItem extends IRoasRanking {
  clickRate?: number; // CTR (%)
  ctrDelta?: number; // CTR 전기 대비 증감 (%)
  conversionRate?: number; // CVR (%)
  conversionDelta?: number; // CVR 전기 대비 증감 (%)
}

// 클릭 스트림 데이터 항목
export interface IClickStreamItem {
  timeSeriesData: {
    minute: string; // 'YYYYMMDDHHmm' 형태
    count: number;
  }[];
  mode: "real" | "dummy";
  hasSuspect: boolean;
  suspectDetail: {
    message: string;
    timestamp: string;
  } | null;
}
