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
