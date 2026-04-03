import type { IAdStatusData, IRoasRanking } from "@/types/dashboard/platform";

// 성과 우수 플랫폼
export const roasRankingMock: IRoasRanking[] = [
  {
    rank: 1,
    provider: "GOOGLE",
    roas: 67.08,
    diffRate: -12,
    revenue: 12345678,
    adSpend: 184000,
  },
  {
    rank: 2,
    provider: "NAVER",
    roas: 19.11,
    diffRate: 12,
    revenue: 8500000,
    adSpend: 444000,
  },
  {
    rank: 3,
    provider: "META",
    roas: 10.98,
    diffRate: 5.4,
    revenue: 5200000,
    adSpend: 472000,
  },
];

// 광고 소재 현황
export const adStatusMock: IAdStatusData = {
  totalCount: 14,
  providerCount: [
    { provider: "GOOGLE", count: 7 },
    { provider: "NAVER", count: 5 },
    { provider: "META", count: 2 },
  ],
};
