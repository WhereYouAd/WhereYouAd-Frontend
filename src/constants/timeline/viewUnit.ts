import type { TTimelineViewUnit } from "@/types/timeline/ui";

export interface ITimelineViewUnitOptions {
  value: TTimelineViewUnit;
  label: string;
}

export const TIMELINE_VIEW_UNIT_OPTIONS: ITimelineViewUnitOptions[] = [
  { value: "DAY", label: "Day" },
  { value: "WEEK", label: "Week" },
  { value: "MONTH", label: "Month" },
];
