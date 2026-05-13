import type {
  IBudgetStatus,
  IPlatformPerformance,
  IRoasRanking,
} from "@/types/dashboard/platform";

// 성과 우수 플랫폼
export const roasRankingMock: IRoasRanking[] = [
  {
    rank: 1,
    provider: "GOOGLE",
    roas: 67.08,
    diffRate: 12,
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

// 플랫폼별 성과 효율 비교
export const performanceEfficiencyMock: IPlatformPerformance[] = [
  {
    provider: "GOOGLE",
    clicks: 12100,
    clickChangeRate: 0.1,
    impressions: 450000,
    impressionChangeRate: 0.05,
    conversion: 5.8,
    cvrChangeRate: 0.02,
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

// 예산 소진 현황
export const budgetStatusMock: IBudgetStatus[] = [
  {
    providerType: "GOOGLE",
    usagePercentage: 0.75,
    totalBudget: 10000000,
    totalSpend: 7500000,
    remainingBudget: 2500000,
  },
  {
    providerType: "NAVER",
    usagePercentage: 0.42,
    totalBudget: 10000000,
    totalSpend: 4200000,
    remainingBudget: 5800000,
  },
  {
    providerType: "META",
    usagePercentage: 0.92,
    totalBudget: 10000000,
    totalSpend: 9200000,
    remainingBudget: 800000,
  },
];

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

// 최근 30일 데이터 생성 함수 (5/5)
const generateRecentData = (
  baseSpend: number,
  baseImp: number,
  baseClicks: number,
  baseConv: number,
) => {
  const data: IPlatformDailyPerformance[] = [];
  const days = ["일", "월", "화", "수", "목", "금", "토"];

  const today = new Date(2026, 4, 5); // 5월 index 4

  for (let i = 0; i < 30; i++) {
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() - i);

    const year = targetDate.getFullYear().toString().slice(-2);
    const month = (targetDate.getMonth() + 1).toString().padStart(2, "0");
    const date = targetDate.getDate().toString().padStart(2, "0");
    const dayName = days[targetDate.getDay()];

    const isWeekend = targetDate.getDay() === 0 || targetDate.getDay() === 6;
    const multiplier = isWeekend ? 0.85 : 1.05;

    const spend = Math.floor(
      baseSpend * multiplier * (0.9 + Math.random() * 0.2),
    );
    const impressions = Math.floor(
      baseImp * multiplier * (0.9 + Math.random() * 0.2),
    );
    const clicks = Math.floor(
      baseClicks * multiplier * (0.9 + Math.random() * 0.2),
    );
    const conversions = Math.floor(
      baseConv * multiplier * (0.9 + Math.random() * 0.2),
    );

    data.push({
      date: `${year}.${month}.${date}(${dayName})`,
      spend,
      impressions,
      clicks,
      ctr: Number(((clicks / impressions) * 100).toFixed(2)),
      cpc: Math.floor(spend / clicks),
      conversions,
      roas: Math.floor(((conversions * 50000) / spend) * 100),
    });
  }
  return data;
};

export const platformDailyPerformanceMock: Record<
  string,
  IPlatformDailyPerformance[]
> = {
  GOOGLE: generateRecentData(5000000, 1000000, 15000, 500),
  NAVER: generateRecentData(2000000, 500000, 5000, 200),
  META: generateRecentData(3000000, 300000, 18000, 300),
};

// 실시간 트래픽 데이터 추가

export interface ITimeSeriesData {
  minute: string; // YYYYMMDDHHmm
  count: number;
}

export interface IClickStreamResponse {
  timeSeriesData: ITimeSeriesData[];
  mode: "real" | "dummy";
  hasSuspect: boolean;
  suspectDetail: {
    provider: string;
    campaignName: string;
    adName: string;
    message: string;
    timestamp: string;
  } | null;
}

/** 실시간 트래픽 데이터 생성 (최근 60분) */
const generateRealTimeTraffic = (
  _platform: string,
  baseCount: number,
): IClickStreamResponse => {
  const timeSeriesData: ITimeSeriesData[] = [];
  const now = new Date();

  for (let i = 59; i >= 0; i--) {
    const targetDate = new Date(now.getTime() - i * 60 * 1000);
    const minuteStr =
      targetDate.getFullYear().toString() +
      (targetDate.getMonth() + 1).toString().padStart(2, "0") +
      targetDate.getDate().toString().padStart(2, "0") +
      targetDate.getHours().toString().padStart(2, "0") +
      targetDate.getMinutes().toString().padStart(2, "0");

    // 시간 흐름에 따른 파동 + 랜덤성 부여
    const wave = Math.sin(targetDate.getTime() / (1000 * 60 * 12)) * 0.4; // 12분 주기의 파동
    const random = (Math.random() - 0.5) * 0.3; // ±15% 랜덤 변동
    const count = Math.max(10, Math.floor(baseCount * (1 + wave + random)));

    timeSeriesData.push({
      minute: minuteStr,
      count,
    });
  }

  // 이상 징후
  return {
    timeSeriesData,
    mode: "dummy",
    hasSuspect: false,
    suspectDetail: null,
  };
};

export const platformTrafficMock: Record<string, IClickStreamResponse> = {
  GOOGLE: generateRealTimeTraffic("GOOGLE", 450),
  NAVER: generateRealTimeTraffic("NAVER", 280),
  META: generateRealTimeTraffic("META", 620),
};
