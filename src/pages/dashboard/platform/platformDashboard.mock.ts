import type {
  IAdStatusData,
  IPlatformPerformance,
  IRoasRanking,
} from "@/types/dashboard/platform";

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

// 플랫폼별 성과 효율 비교
export const performanceEfficiencyMock: IPlatformPerformance[] = [
  {
    provider: "GOOGLE",
    clicks: 12100,
    clickChangeRate: 0.1,
    impressions: 450000,
    impressionChangeRate: 0.05,
    conversion: 5.8,
    cvrChangeRate: -0.02,
    ROAS: 67.08,
    ROASChangeRate: 0.12,
  },
  {
    provider: "NAVER",
    clicks: 8500,
    clickChangeRate: -0.05,
    impressions: 580000,
    impressionChangeRate: 0.1,
    conversion: 3.2,
    cvrChangeRate: 0.01,
    ROAS: 19.11,
    ROASChangeRate: -0.05,
  },
  {
    provider: "META",
    clicks: 15600,
    clickChangeRate: 0.15,
    impressions: 320000,
    impressionChangeRate: 0.2,
    conversion: 8.5,
    cvrChangeRate: 0.08,
    ROAS: 10.98,
    ROASChangeRate: 0.05,
  },
];
