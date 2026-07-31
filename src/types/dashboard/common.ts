// 공통 지표 응답 (overview/platform 공유)
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

// 예산 금액 단위 (API 분리 응답)
export interface IBudgetAmountSlice {
  totalBudget: number;
  totalSpend: number;
}

// 예산 소진 현황
export interface IBudgetResponse {
  providerType: string;
  usagePercentage: number;
  totalBudget: number;
  totalSpend: number;
  remainingBudget: number;
  /** 통합 대시보드 — Google·Meta / Naver 분리 */
  googleMeta?: IBudgetAmountSlice;
  naver?: IBudgetAmountSlice;
  /** 플랫폼 Google/Meta — 전체 / 일일 분리 */
  lifetime?: IBudgetAmountSlice;
  daily?: IBudgetAmountSlice;
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
