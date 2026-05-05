import type { TProviderType } from "./overview";

export type TPlatformProvider = TProviderType | "META";

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
  totalCount: number;
  providerCount: IAdCount[];
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
