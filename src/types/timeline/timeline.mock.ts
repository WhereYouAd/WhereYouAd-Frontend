import type { TProviderType } from "@/types/dashboard/provider";
import type {
  ITimelineDetail,
  ITimelineListItem,
  ITimelineMutationResponse,
} from "@/types/timeline/api";
import type { ITimelineSummaryPanelData } from "@/types/timeline/summary";
import type {
  ITimelineCampaignBar,
  ITimelineGridColumn,
  ITimelineGridData,
  TTimelineViewUnit,
} from "@/types/timeline/ui";

const WEEKDAY_KO = ["일", "월", "화", "수", "목", "금", "토"] as const;

function buildMonthColumns(
  year: number,
  month: number,
  daysInMonth: number,
  todayDate: number,
): ITimelineGridColumn[] {
  const firstDay = new Date(year, month - 1, 1).getDay();

  return Array.from({ length: daysInMonth }, (_, index) => {
    const date = index + 1;
    const dayIndex = (firstDay + index) % 7;

    return {
      day: WEEKDAY_KO[dayIndex],
      date,
      isWeekend: dayIndex === 0 || dayIndex === 6,
      isToday: date === todayDate,
    };
  });
}

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
    performanceStatus: "UNDERPERFORM",
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
  comparisonPeriodType: "LAST_WEEK",
  summary:
    "해당 기간 동안 클릭수는 전반적으로 증가하며 평균 이상의 성과를 보였습니다. 특히 6월 23일에 가장 높은 클릭수를 기록했으며, 이후에도 높은 수준을 유지했습니다. 다만 전환수는 후반부로 갈수록 소폭 감소하는 흐름을 보였습니다.",
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

/*UI 그리드 mock — 주간*/
export const TIMELINE_GRID_MOCK_WEEK: ITimelineGridData = {
  viewUnit: "WEEK",
  periodLabel: "21 June - 27 June",
  columns: [
    { day: "일", date: 21, isWeekend: true },
    { day: "월", date: 22, isWeekend: false },
    { day: "화", date: 23, isWeekend: false },
    { day: "수", date: 24, isWeekend: false },
    { day: "목", date: 25, isWeekend: false },
    { day: "금", date: 26, isWeekend: false },
    { day: "토", date: 27, isWeekend: true, isToday: true },
  ],
  bars: [
    {
      id: 1,
      title: "평일 성과 요약",
      subtitle: "06.22 - 06.26",
      providers: ["GOOGLE"],
      colStart: 2,
      colEnd: 7,
      row: 1,
      performanceStatus: "ABOVE_AVERAGE",
    },
    {
      id: 2,
      title: "리타겟팅 캠페인",
      subtitle: "06.25 - 06.27",
      providers: ["GOOGLE", "META", "NAVER"],
      colStart: 5,
      colEnd: 8,
      row: 2,
      performanceStatus: "ON_TRACK",
    },
  ],
};

export const TIMELINE_GRID_MOCK = TIMELINE_GRID_MOCK_WEEK;

export const TIMELINE_GRID_MOCK_DAY: ITimelineGridData = {
  viewUnit: "DAY",
  periodLabel: "6월 27일",
  columns: [{ day: "토", date: 27, isWeekend: true, isToday: true }],
  bars: [
    {
      id: 1,
      title: "평일 성과 요약",
      subtitle: "06.27",
      providers: ["GOOGLE"],
      colStart: 1,
      colEnd: 2,
      row: 1,
      performanceStatus: "ABOVE_AVERAGE",
    },
    {
      id: 2,
      title: "리타겟팅 캠페인",
      subtitle: "06.27",
      providers: ["GOOGLE", "META", "NAVER"],
      colStart: 1,
      colEnd: 2,
      row: 2,
      performanceStatus: "ON_TRACK",
    },
  ],
};

export const TIMELINE_GRID_MOCK_MONTH: ITimelineGridData = {
  viewUnit: "MONTH",
  periodLabel: "2026년 6월",
  columns: buildMonthColumns(2026, 6, 30, 27),
  bars: [
    {
      id: 1,
      title: "평일 성과 요약",
      subtitle: "06.01 - 06.15",
      providers: ["GOOGLE"],
      colStart: 1,
      colEnd: 16,
      row: 1,
      performanceStatus: "ABOVE_AVERAGE",
    },
    {
      id: 2,
      title: "리타겟팅 캠페인",
      subtitle: "06.16 - 06.30",
      providers: ["GOOGLE", "META", "NAVER"],
      colStart: 16,
      colEnd: 31,
      row: 2,
      performanceStatus: "UNDERPERFORM",
    },
  ],
};

export const TIMELINE_GRID_MOCK_BY_VIEW_UNIT: Record<
  TTimelineViewUnit,
  ITimelineGridData
> = {
  DAY: TIMELINE_GRID_MOCK_DAY,
  WEEK: TIMELINE_GRID_MOCK_WEEK,
  MONTH: TIMELINE_GRID_MOCK_MONTH,
};

export const TIMELINE_GRID_EMPTY_MOCK: ITimelineGridData = {
  ...TIMELINE_GRID_MOCK,
  bars: [],
};

/*성과 요약 패널 mock*/
export const TIMELINE_SUMMARY_PANEL_MOCK: ITimelineSummaryPanelData = {
  timelineName: TIMELINE_DETAIL_MOCK.name,
  periodLabel: "2026.06.01 ~ 2026.06.30",
  performanceStatus: "ABOVE_AVERAGE",
  aiSummary: TIMELINE_DETAIL_MOCK.summary,
  metrics: [
    { metric: "CLICK", label: "클릭", value: 3730, changeRate: 0.08 },
    { metric: "CONVERSION", label: "전환", value: 255, changeRate: 0.12 },
    { metric: "IMPRESSION", label: "노출", value: 136100, changeRate: 0.05 },
    {
      metric: "ROAS",
      label: "ROAS",
      value: 3.17,
      unit: "배",
      changeRate: -0.03,
    },
  ],
  platformShare: [
    { provider: "GOOGLE", contributionRate: 0.52 },
    { provider: "META", contributionRate: 0.31 },
    { provider: "NAVER", contributionRate: 0.17 },
  ],
  dailyTrend: TIMELINE_DETAIL_MOCK.dailyTrend,
  startDate: TIMELINE_DETAIL_MOCK.startDate,
  endDate: TIMELINE_DETAIL_MOCK.endDate,
};

export const TIMELINE_SUMMARY_PANEL_NO_AI_MOCK: ITimelineSummaryPanelData = {
  ...TIMELINE_SUMMARY_PANEL_MOCK,
  aiSummary: "",
};

const TIMELINE_SUMMARY_PANEL_MOCK_BAR_OVERRIDES: Record<
  number,
  Partial<ITimelineSummaryPanelData>
> = {
  1: {
    metrics: [
      { metric: "CLICK", label: "클릭", value: 2480, changeRate: 0.12 },
      { metric: "CONVERSION", label: "전환", value: 182, changeRate: 0.09 },
      { metric: "IMPRESSION", label: "노출", value: 92100, changeRate: 0.04 },
      {
        metric: "ROAS",
        label: "ROAS",
        value: 3.42,
        unit: "배",
        changeRate: 0.06,
      },
    ],
    aiSummary:
      "평일 구간에서 클릭과 전환이 비교 기간 대비 안정적으로 증가했습니다.",
  },
  2: {
    metrics: [
      { metric: "CLICK", label: "클릭", value: 1250, changeRate: -0.02 },
      { metric: "CONVERSION", label: "전환", value: 73, changeRate: -0.05 },
      { metric: "IMPRESSION", label: "노출", value: 43900, changeRate: 0.01 },
      {
        metric: "ROAS",
        label: "ROAS",
        value: 2.84,
        unit: "배",
        changeRate: -0.04,
      },
    ],
    aiSummary:
      "리타겟팅 구간은 클릭은 유지됐지만 전환 효율이 비교 기간 대비 다소 낮습니다.",
  },
};

function buildPlatformShareFromProviders(
  providers?: TProviderType[],
): ITimelineSummaryPanelData["platformShare"] {
  if (!providers?.length) {
    return TIMELINE_SUMMARY_PANEL_MOCK.platformShare;
  }

  const rate = 1 / providers.length;
  return providers.map((provider) => ({
    provider,
    contributionRate: rate,
  }));
}

export function buildTimelineSummaryPanelDataForBar(
  bar: ITimelineCampaignBar,
): ITimelineSummaryPanelData {
  const overrides = TIMELINE_SUMMARY_PANEL_MOCK_BAR_OVERRIDES[bar.id] ?? {};

  return {
    ...TIMELINE_SUMMARY_PANEL_MOCK,
    ...overrides,
    timelineName: bar.title,
    periodLabel: bar.subtitle,
    performanceStatus: bar.performanceStatus,
    platformShare: buildPlatformShareFromProviders(bar.providers),
  };
}
