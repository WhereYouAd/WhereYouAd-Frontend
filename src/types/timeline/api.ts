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
 * ABOVE_AVG: 최근 평균 대비 눈에 띄게 좋음
 * UNDERPERFORM: 최근 평균 대비 눈에 띄게 낮음
 * (미산출 시 null — UI에서는 PENDING으로 표시)
 */
export const TIMELINE_PERFORMANCE_STATUS = [
  "ON_TRACK",
  "ABOVE_AVG",
  "UNDERPERFORM",
] as const;
export type TTimelinePerformanceStatus =
  (typeof TIMELINE_PERFORMANCE_STATUS)[number];

export const TIMELINE_SORTS = ["DISPLAY_ORDER", "LATEST", "OLDEST"] as const;
export type TTimelineSort = (typeof TIMELINE_SORTS)[number];

/** API 3종 + UI 전용 미정(PENDING). null/미지 값은 UI에서 PENDING으로 정규화 */
export type TTimelinePerformanceStatusUi =
  | TTimelinePerformanceStatus
  | "PENDING";

/*비교 기간 타입*/
export const TIMELINE_COMPARISON_PERIOD_TYPES = [
  "LAST_WEEK",
  "LAST_MONTH",
  "LAST_YEAR",
] as const;
export type TTimelineComparisonPeriodType =
  (typeof TIMELINE_COMPARISON_PERIOD_TYPES)[number];

export interface ITimelineListItem {
  timelineId: number;
  name: string;
  startDate: string;
  endDate: string;
  /** 성과 미산출 시 null일 수 있음 */
  performanceStatus: TTimelinePerformanceStatus | null;
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
  /** 성과 미산출 시 null일 수 있음 */
  performanceStatus: TTimelinePerformanceStatus | null;
  metrics: TTimelineMetric[];
  comparisonPeriodType: TTimelineComparisonPeriodType;
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
  /** 성과 미산출 시 null일 수 있음 */
  performanceStatus: TTimelinePerformanceStatus | null;
  createdAt: string;
}

/*DELETE / summary 요청 등 빈 data*/
export type TTimelineEmptyResponse = Record<string, never>;

export interface IUpdateTimelineVariables {
  timelineId: number;
  body: ITimelineUpsertRequest;
}

/*목록 조회 쿼리. status가 생략되면 전체보이도록*/
export interface ITimelineListParams {
  status?: TTimelinePerformanceStatus;
  sort?: TTimelineSort;
}

export interface IUpdateTimelineDisplayOrderRequest {
  timelineIds: number[];
}
