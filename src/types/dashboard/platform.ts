import type { TProviderType } from "./overview";

export type TPlatformProvider = TProviderType | "META";

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
