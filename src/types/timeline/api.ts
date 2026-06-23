import type { TProviderType } from "../dashboard/provider";

/*타임라인 추적 지표*/
export const TIMELINE_METRICS = [
  "CLICK",
  "CONVERSION",
  "IMPRESSION",
  "ROAS",
] as const;
export type TTimelineMetric = (typeof TIMELINE_METRICS)[number];

/*성과 상태
 * ON_TRACK: 최근 추세와 유사한 수준 유지
 * ABOVE_AVERAGE: 최근 평균 대비 눈에 띄게 좋음
 * AT_RISK: 최근 평균 대비 눈에 띄게 낮음
 */
export const TIMELINE_PERFORMANCE_STATUS = [
  "ON_TRACK",
  "ABOVE_AVERAGE",
  "AT_RISK",
] as const;
export type TTimelinePerformanceStatus =
  (typeof TIMELINE_PERFORMANCE_STATUS)[number];

/*비교 기간 타입*/
export const TIMELINE_COMPARISON_PERIOD_TYPES = [
  "LAST_WEEK",
  "LAST_MONTH",
  "PREVIOUS_PERIOD",
] as const;
export type TTimelineComparisonPeriodType =
  (typeof TIMELINE_COMPARISON_PERIOD_TYPES)[number];

export interface ITimelineListItem {
  timelineId: number;
  name: string;
  startDate: string;
  endDate: string;
  performanceStatus: TTimelinePerformanceStatus;
}

export interface ITimelineDailyTrend {
  date: string;
  clicks: number;
  conversions: number;
  impressions: number;
  roas: number;
}

export interface ITimelinePlatformContribution {
  platform: TProviderType;
  contributionRate: number;
}

export interface ITimelineDetail {
  timelineId: number;
  name: string;
  startDate: string;
  endDate: string;
  performanceStatus: TTimelinePerformanceStatus;
  metrics: TTimelineMetric[];
  summary: string;
  dailyTrend: ITimelineDailyTrend[];
  platformContributions: ITimelinePlatformContribution[];
}

/* Request body*/
export interface ITimelineUpsertRequest {
  name: string;
  startDate: string;
  endDate: string;
  metrics: TTimelineMetric[];
  comparisonPeriodType: TTimelineComparisonPeriodType;
}

export interface ITimelineMutationResponse {
  timelineId: number;
  name: string;
  startDate: string;
  endDate: string;
  metrics: TTimelineMetric[];
  comparisonStartDate: string;
  comparisonEndDate: string;
  performanceStatus: TTimelinePerformanceStatus;
  createdAt: string;
}

/*DELETE / summary 요청 등 빈 data*/
export type TTimelineEmptyResponse = Record<string, never>;
