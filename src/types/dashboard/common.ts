import type { TProviderType } from "./provider";

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

// 예산 금액 단위
export interface IBudgetAmountSlice {
  totalBudget: number;
  totalSpend: number;
}

/** 대시보드 예산 group.budgetType */
export type TDashboardBudgetType = "TOTAL" | "DAILY";

/** 대시보드 예산 group.detail */
export interface IBudgetGroupDetail {
  budget: number;
  spend: number;
  remainingBudget: number;
  /** 0~100 */
  remainingPercentage: number;
  estimated: boolean;
}

/** 대시보드 예산 groups[] 항목 */
export interface IBudgetGroup {
  budgetType: TDashboardBudgetType;
  providers: TProviderType[];
  detail: IBudgetGroupDetail;
}

/** GET /api/dashboard/budgets 응답 data */
export interface IBudgetResponse {
  /** 통합: "ALL", 플랫폼: GOOGLE | META | NAVER */
  providerType: TProviderType | "ALL";
  groups: IBudgetGroup[];
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
