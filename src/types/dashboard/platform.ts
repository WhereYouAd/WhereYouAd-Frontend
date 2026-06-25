import type { IMetricsResponse } from "./common";
import type { TProviderType } from "./provider";

export type { IBudgetResponse, IMetricsResponse, IRoasRanking } from "./common";
export type { TProviderType };

// 플랫폼 광고 소재 개수
export interface IAdCount {
  provider: TProviderType;
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
export interface IPlatformPerformance extends IMetricsResponse {
  provider: TProviderType;
}

// 플랫폼별 성과 효율 비교
export interface IPlatformEfficiencyData {
  status: string;
  data: IPlatformPerformance[];
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
  cpa: number;
  conversions: number;
  roas: number;
}
