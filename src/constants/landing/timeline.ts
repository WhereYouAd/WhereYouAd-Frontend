export type TLandingTimelineColumn = {
  day: string;
  date: number;
  isWeekend: boolean;
  isToday?: boolean;
};

export type TLandingTimelineCard = {
  id: number;
  title: string;
  subtitle: string;
  colStart: number;
  colEnd: number;
  row: number;
  colorClass: string;
};

export const LANDING_TIMELINE_COLUMNS: TLandingTimelineColumn[] = [
  { day: "M", date: 30, isWeekend: false },
  { day: "T", date: 31, isWeekend: false },
  { day: "W", date: 1, isWeekend: false },
  { day: "T", date: 2, isWeekend: false, isToday: true },
  { day: "F", date: 3, isWeekend: false },
  { day: "S", date: 4, isWeekend: true },
  { day: "S", date: 5, isWeekend: true },
  { day: "M", date: 6, isWeekend: false },
  { day: "T", date: 7, isWeekend: false },
  { day: "W", date: 8, isWeekend: false },
  { day: "T", date: 9, isWeekend: false },
  { day: "F", date: 10, isWeekend: false },
  { day: "S", date: 11, isWeekend: true },
  { day: "S", date: 12, isWeekend: true },
  { day: "M", date: 13, isWeekend: false },
  { day: "T", date: 14, isWeekend: false },
  { day: "W", date: 15, isWeekend: false },
];

export const LANDING_TIMELINE_CARDS: TLandingTimelineCard[] = [
  {
    id: 1,
    title: "봄 프로모션 캠페인",
    subtitle: "Google Ads · 전환",
    colStart: 3.2,
    colEnd: 9,
    row: 1,
    colorClass: "bg-status-blue",
  },
  {
    id: 2,
    title: "리타겟팅 캠페인",
    subtitle: "Meta · 트래픽",
    colStart: 8.9,
    colEnd: 15.3,
    row: 2,
    colorClass: "bg-logo-2",
  },
  {
    id: 3,
    title: "브랜드 검색 캠페인",
    subtitle: "Naver · 검색",
    colStart: 2.4,
    colEnd: 8,
    row: 3,
    colorClass: "bg-status-green",
  },
];
