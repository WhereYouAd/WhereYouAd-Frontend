// 광고 플랫폼 종류
export type TProviderType = "META" | "NAVER" | "GOOGLE";

// 전체 지표 집계 응답
export interface IMetricsResponse {
  clicks: number;
  clickChangeRate: number;
  impressions: number;
  impressionChangeRate: number;
  conversion: number;
  cvrChangeRate: number;
  ROAS: number;
  ROASChangeRate: number;
}

// 예산 집계 응답
export interface IBudgetsResponse {
  providerType: string;
  usagePercentage: number;
  totalBudget: number;
  totalSpend: number;
  remainingBudget: number;
}

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

// ROAS 순위 항목
export interface IRoasRanking {
  rank: number;
  provider: string;
  roas: number;
  diffRate: number | null;
  revenue: number;
  adSpend: number;
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
