import type { TTimelineViewUnit } from "@/types/timeline/ui";

export interface ITimelineViewUnitOptions {
  value: TTimelineViewUnit;
  label: string;
}

export const TIMELINE_VIEW_UNIT_OPTIONS: ITimelineViewUnitOptions[] = [
  { value: "DAY", label: "일" },
  { value: "WEEK", label: "주" },
  { value: "MONTH", label: "월" },
];
