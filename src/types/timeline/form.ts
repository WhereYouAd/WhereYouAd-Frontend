import type {
  TTimelineComparisonPeriodType,
  TTimelineMetric,
} from "@/types/timeline/api";

export interface ITimelineFormValues {
  name: string;
  startDate: string;
  endDate: string;
  metrics: TTimelineMetric[];
  comparisonPeriodType: TTimelineComparisonPeriodType;
}

/*후속 zod 연동 전 기본값*/
export const TIMELINE_FORM_DEFAULT_VALUES: ITimelineFormValues = {
  name: "",
  startDate: "",
  endDate: "",
  metrics: ["CLICK"],
  comparisonPeriodType: "LAST_WEEK",
};
