import type {
  ITimelineCampaignBar,
  ITimelineGridColumn,
} from "@/types/timeline/ui";

export const LANDING_TIMELINE_COLUMNS: ITimelineGridColumn[] = [
  { day: "일", date: 2, isWeekend: true },
  { day: "월", date: 3, isWeekend: false },
  { day: "화", date: 4, isWeekend: false },
  { day: "수", date: 5, isWeekend: false },
  { day: "목", date: 6, isWeekend: false },
  { day: "금", date: 7, isWeekend: false },
  { day: "토", date: 8, isWeekend: true },
];

export const LANDING_TIMELINE_BARS: ITimelineCampaignBar[] = [
  {
    id: 1,
    title: "썸머 프로모션 캠페인",
    subtitle: "08.01 - 08.31",
    providers: ["GOOGLE"],
    colStart: 1,
    colEnd: 8,
    row: 1,
    performanceStatus: "ON_TRACK",
  },
  {
    id: 2,
    title: "신규회원 프로모션 캠페인",
    subtitle: "08.03 - 08.16",
    providers: ["GOOGLE"],
    colStart: 2,
    colEnd: 8,
    row: 2,
    performanceStatus: "ABOVE_AVG",
  },
];
