import {
  TIMELINE_COMPARISON_PERIOD_TYPES,
  TIMELINE_METRICS,
  type TTimelineComparisonPeriodType,
  type TTimelineMetric,
} from "@/types/timeline/api";

export const TIMELINE_METRIC_OPTIONS: ReadonlyArray<{
  value: TTimelineMetric;
  label: string;
}> = [
  { value: "CLICK", label: "클릭" },
  { value: "CONVERSION", label: "전환" },
  { value: "IMPRESSION", label: "노출" },
  { value: "ROAS", label: "ROAS" },
] as const;

export const TIMELINE_COMPARISON_PERIOD_OPTIONS: ReadonlyArray<{
  value: TTimelineComparisonPeriodType;
  label: string;
}> = [
  { value: "LAST_WEEK", label: "지난주 대비" },
  { value: "LAST_MONTH", label: "지난달 대비" },
  { value: "LAST_YEAR", label: "작년 동기간 대비" },
] as const;

/*zod enum 용 - 타입과 동기화*/
export const TIMELINE_METRIC_VALUES = TIMELINE_METRICS;
export const TIMELINE_COMPARISON_PERIOD_VALUES =
  TIMELINE_COMPARISON_PERIOD_TYPES;
