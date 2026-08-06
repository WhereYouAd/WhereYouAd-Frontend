import type {
  TTimelinePerformanceStatus,
  TTimelineSort,
} from "@/types/timeline/api";

import { TIMELINE_PERFORMANCE_STATUS_STYLE } from "./statusStyle";

export type TTimelineStatusFilter = TTimelinePerformanceStatus | "ALL";

export const TIMELINE_STATUS_FILTER_OPTIONS: {
  value: TTimelineStatusFilter;
  label: string;
}[] = [
  { value: "ALL", label: "전체" },
  {
    value: "ON_TRACK",
    label: TIMELINE_PERFORMANCE_STATUS_STYLE.ON_TRACK.label,
  },
  {
    value: "ABOVE_AVG",
    label: TIMELINE_PERFORMANCE_STATUS_STYLE.ABOVE_AVG.label,
  },
  {
    value: "UNDERPERFORM",
    label: TIMELINE_PERFORMANCE_STATUS_STYLE.UNDERPERFORM.label,
  },
];

export const TIMELINE_SORT_OPTIONS: {
  value: TTimelineSort;
  label: string;
}[] = [
  { value: "DISPLAY_ORDER", label: "기본 순서" },
  { value: "LATEST", label: "종료일 먼 순" },
  { value: "OLDEST", label: "종료일 가까운 순" },
];
