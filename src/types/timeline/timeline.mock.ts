import type {
  ITimelineDetail,
  ITimelineListItem,
  ITimelineMutationResponse,
} from "@/types/timeline/api";
import type { ITimelineSummaryPanelData } from "@/types/timeline/summary";
import type { ITimelineGridData } from "@/types/timeline/ui";

/*GET /timeline 목록 mock*/
export const TIMELINE_LIST_MOCK: ITimelineListItem[] = [
  {
    timelineId: 1,
    name: "6월 봄 프로모션",
    startDate: "2026-06-01",
    endDate: "2026-06-30",
    performanceStatus: "ON_TRACK",
  },
  {
    timelineId: 2,
    name: "리타겟팅 집중 기간",
    startDate: "2026-06-10",
    endDate: "2026-06-30",
    performanceStatus: "AT_RISK",
  },
];

/*GET /timeline/{id} 상세 mock*/
export const TIMELINE_DETAIL_MOCK: ITimelineDetail = {
  timelineId: 1,
  name: "6월 봄 프로모션",
  startDate: "2026-06-01",
  endDate: "2026-06-30",
  performanceStatus: "ON_TRACK",
  metrics: ["CLICK", "CONVERSION", "ROAS"],
  summary:
    "Google Ads 전환이 전주 대비 12% 상승했습니다. Meta는 노출은 늘었으나 ROAS가 소폭 하락했습니다.",
  dailyTrend: [
    {
      date: "2026-06-18",
      clicks: 1240,
      conversions: 86,
      impressions: 45200,
      roas: 3.2,
    },
    {
      date: "2026-06-19",
      clicks: 1310,
      conversions: 91,
      impressions: 46800,
      roas: 3.4,
    },
    {
      date: "2026-06-20",
      clicks: 1180,
      conversions: 78,
      impressions: 44100,
      roas: 2.9,
    },
  ],
  platformContributions: [
    { platform: "GOOGLE", contributionRate: 0.52 },
    { platform: "META", contributionRate: 0.31 },
    { platform: "NAVER", contributionRate: 0.17 },
  ],
};

/*POST 생성 응답 mock*/
export const TIMELINE_CREATE_RESPONSE_MOCK: ITimelineMutationResponse = {
  timelineId: 3,
  name: "신규 타임라인",
  startDate: "2026-06-01",
  endDate: "2026-06-30",
  metrics: ["CLICK"],
  comparisonStartDate: "2026-05-25",
  comparisonEndDate: "2026-05-31",
  performanceStatus: "ON_TRACK",
  createdAt: "2026-06-20T07:58:24.795Z",
};

/*UI 그리드 mock*/
export const TIMELINE_GRID_MOCK: ITimelineGridData = {
  viewUnit: "WEEK",
  periodLabel: "30 Dec - 5 Jan",
  columns: [
    { day: "M", date: 30, isWeekend: false },
    { day: "T", date: 31, isWeekend: false },
    { day: "W", date: 1, isWeekend: false },
    { day: "T", date: 2, isWeekend: false, isToday: true },
    { day: "F", date: 3, isWeekend: false },
    { day: "S", date: 4, isWeekend: true },
    { day: "S", date: 5, isWeekend: true },
  ],
  bars: [
    {
      id: 1,
      title: "봄 프로모션 캠페인",
      subtitle: "Google Ads 전환",
      provider: "GOOGLE",
      colStart: 3.2,
      colEnd: 9,
      row: 1,
      colorClass: "bg-primary-300",
      performanceStatus: "ON_TRACK",
    },
    {
      id: 2,
      title: "리타겟팅 캠페인",
      subtitle: "META 트래픽",
      provider: "META",
      colStart: 8.9,
      colEnd: 15.3,
      row: 2,
      colorClass: "bg-primary-400",
      performanceStatus: "AT_RISK",
    },
  ],
};

/*성과 요약 패널 mock*/
export const TIMELINE_SUMMARY_PANEL_MOCK: ITimelineSummaryPanelData = {
  timelineName: TIMELINE_DETAIL_MOCK.name,
  periodLabel: "2026.06.01 ~ 2026.06.30",
  aiSummary: TIMELINE_DETAIL_MOCK.summary,
  metrics: [
    { metric: "CLICK", label: "클릭", value: 3730, changeRate: 0.08 },
    { metric: "CONVERSION", label: "전환", value: 255, changeRate: 0.12 },
    { metric: "IMPRESSION", label: "노출", value: 136100, changeRate: 0.05 },
    {
      metric: "ROAS",
      label: "ROAS",
      value: 3.17,
      unit: "x",
      changeRate: -0.03,
    },
  ],
  platformShare: [
    { provider: "GOOGLE", contributionRate: 0.52 },
    { provider: "META", contributionRate: 0.31 },
    { provider: "NAVER", contributionRate: 0.17 },
  ],
};
