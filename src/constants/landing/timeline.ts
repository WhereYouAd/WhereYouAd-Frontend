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
];

export const LANDING_TIMELINE_CARDS: TLandingTimelineCard[] = [
  {
    id: 1,
    title: "봄 프로모션 캠페인",
    subtitle: "Google Ads · 전환",
    colStart: 1,
    colEnd: 4.8,
    row: 1,
    colorClass: "bg-primary-300",
  },
  {
    id: 2,
    title: "리타겟팅 캠페인",
    subtitle: "Meta · 트래픽",
    colStart: 3,
    colEnd: 7,
    row: 2,
    colorClass: "bg-primary-400",
  },
];
