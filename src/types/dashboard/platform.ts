import type { TProviderType } from "./overview";

export type TPlatformProvider = TProviderType;

export const PLATFORM_MAP: Record<string, string> = {
  GOOGLE: "Google",
  NAVER: "NAVER",
  META: "Meta",
};

// ROAS 성과 순위
export interface IRoasRanking {
  rank: number;
  provider: string;
  roas: number;
  diffRate: number | null;
  revenue: number;
  adSpend: number;
}

// 플랫폼 광고 소재 개수
export interface IAdCount {
  provider: TPlatformProvider;
  count: number;
}

// 광고 소재 현황
export interface IAdStatusData {
  startDate: string;
  endDate: string;
  totalCount: number;
  providerCount: IAdCount[];
}

//광고 소재 현황 조회 요청 파라미터
export interface IAdCountParams {
  startDate?: string;
  endDate?: string;
}

// 플랫폼별 성과
export interface IPlatformPerformance {
  provider: TPlatformProvider;
  clicks: number;
  clickChangeRate: number;
  impressions: number;
  impressionChangeRate: number;
  conversion: number;
  cvrChangeRate: number;
  ROAS: number;
  ROASChangeRate: number;
}

// 플랫폼별 성과 효율 비교
export interface IPlatformEfficiencyData {
  status: string;
  data: IPlatformPerformance[];
}

// 예산 소진 현황
export interface IBudgetStatus {
  providerType: string;
  usagePercentage: number;
  totalBudget: number;
  totalSpend: number;
  remainingBudget: number;
}

// API 일자별·합계
export interface IMetricFactsRow {
  date: string;
  impressions: number;
  clicks: number;
  spend: number;
  conversions: number;
  revenue: number;
  ctr: number;
  cpa: number;
  roas: number;
}

// /api/dashboard/{orgId}/metric-facts 응답 data
export interface IMetricFactsResponse {
  providerType: string;
  startDate: string;
  endDate: string;
  total: IMetricFactsRow;
  dailyMetrics: IMetricFactsRow[];
}

export interface IMetricFactsParams {
  providerType: TProviderType;
  days?: number;
}

// 테이블 UI row
export interface IPlatformDailyPerformance {
  date: string;
  spend: number;
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
  conversions: number;
  roas: number;
}
