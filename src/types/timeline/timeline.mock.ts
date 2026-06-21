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
  periodLabel: "21 June - 27 June",
  columns: [
    { day: "일", date: 21, isWeekend: true },
    { day: "월", date: 22, isWeekend: false },
    { day: "화", date: 23, isWeekend: false },
    { day: "수", date: 24, isWeekend: false },
    { day: "목", date: 25, isWeekend: false },
    { day: "금", date: 26, isWeekend: true },
    { day: "토", date: 27, isWeekend: true, isToday: true },
  ],
  bars: [
    {
      id: 1,
      title: "평일 성과 요약",
      subtitle: "06.22 - 06.26",
      provider: "GOOGLE",
      colStart: 2,
      colEnd: 7,
      row: 1,
      performanceStatus: "ABOVE_AVERAGE",
    },
    {
      id: 2,
      title: "리타겟팅 캠페인",
      subtitle: "06.25 - 06.27",
      provider: "META",
      colStart: 4,
      colEnd: 7,
      row: 2,
      performanceStatus: "ON_TRACK",
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
