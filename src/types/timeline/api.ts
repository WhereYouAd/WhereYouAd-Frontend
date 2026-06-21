/*타임라인 추적 지표*/
export const TIMELINE_METRICS = [
  "CLICK",
  "CONVERSION",
  "IMPRESSION",
  "ROAS",
] as const;
export type TTimelineMetric = (typeof TIMELINE_METRICS)[number];

/*성과 상태*/
export const TIMELINE_PERFORMANCE_STATUS = [
  "ON_TRACK",
  "AT_RISK",
  "OFF_TRACK",
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
  platform: string;
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
