import type { TProviderType } from "@/types/dashboard/provider";
import type { TTimelinePerformanceStatus } from "@/types/timeline/api";

export type TTimelineViewUnit = "DAY" | "WEEK" | "MONTH";

/*날짜 축 한칸*/
export interface ITimelineGridColumn {
  day: string;
  date: number;
  isWeekend: boolean;
  isToday?: boolean;
  /*원본 날짜*/
  isoDate?: string;
}

/*타임라인 위 캠페인 바*/
export interface ITimelineCampaignBar {
  id: number;
  title: string;
  subtitle: string;
  provider?: TProviderType;
  colStart: number; //그리드 시작 위치
  colEnd: number;
  row: number;
  colorClass: string;
  performanceStatus?: TTimelinePerformanceStatus;
}

/*그리드 + 바 묶음*/
export interface ITimelineGridData {
  viewUnit: TTimelineViewUnit;
  periodLabel: string;
  columns: ITimelineGridColumn[];
  bars: ITimelineCampaignBar[];
}
