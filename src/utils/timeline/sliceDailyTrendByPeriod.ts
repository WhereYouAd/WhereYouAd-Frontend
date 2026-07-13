import type { ITimelineDailyTrend } from "@/types/timeline/api";
import type { TTimelineViewUnit } from "@/types/timeline/ui";

import {
  type ITimelineVisiblePeriod,
  parseIsoDate,
  resolveVisiblePeriod,
  startOfDay,
  toIsoDate,
} from "./period";

export interface ISliceDailyTrendByPeriodParams {
  dailyTrend: ITimelineDailyTrend[];
  viewUnit: TTimelineViewUnit;
  periodIndex: number;
  timelineStartDate: string;
  timelineEndDate: string;
  today?: Date;
}

export interface ISliceDailyTrendByPeriodResult {
  periodLabel: string;
  visiblePeriod: ITimelineVisiblePeriod;
  slicedTrend: ITimelineDailyTrend[];
  /** 차트 X축 채우기용 — 선택 구간 전체. 타임라인과 안 겹치면 null */
  rangeStart: Date | null;
  rangeEnd: Date | null;
}

function clampRangeToTimeline(
  visible: ITimelineVisiblePeriod,
  timelineStartDate: string,
  timelineEndDate: string,
): { start: Date; end: Date } | null {
  const timelineStart = startOfDay(parseIsoDate(timelineStartDate));
  const timelineEnd = startOfDay(parseIsoDate(timelineEndDate));

  const start =
    visible.start.getTime() > timelineStart.getTime()
      ? visible.start
      : timelineStart;

  const end =
    visible.end.getTime() < timelineEnd.getTime() ? visible.end : timelineEnd;

  // 선택 구간이 타임라인과 안겹치면 null
  if (start.getTime() > end.getTime()) return null;

  return { start, end };
}

function isDateInRange(isoDate: string, start: Date, end: Date): boolean {
  const t = startOfDay(parseIsoDate(isoDate)).getTime();
  return t >= startOfDay(start).getTime() && t <= startOfDay(end).getTime();
}

/*viewUnit과 periodIndex로 보이는 기간 정하고, dailyTend에서 그 기간을 자른다. 그리고 잘린건 일별 배열을 그대로 그릴예정*/
export function sliceDailyTrendByPeriod({
  dailyTrend,
  viewUnit,
  periodIndex,
  timelineStartDate,
  timelineEndDate,
  today = new Date(),
}: ISliceDailyTrendByPeriodParams): ISliceDailyTrendByPeriodResult {
  const visiblePeriod = resolveVisiblePeriod(viewUnit, periodIndex, today);
  const clamped = clampRangeToTimeline(
    visiblePeriod,
    timelineStartDate,
    timelineEndDate,
  );

  if (!clamped) {
    return {
      periodLabel: visiblePeriod.periodLabel,
      visiblePeriod,
      slicedTrend: [],
      rangeStart: null,
      rangeEnd: null,
    };
  }

  const slicedTrend = dailyTrend
    .filter((row) => isDateInRange(row.date, clamped.start, clamped.end))
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date));

  return {
    periodLabel: visiblePeriod.periodLabel,
    visiblePeriod,
    slicedTrend,
    // X축은 선택 구간 전체. 데이터 없는 날은 fill 시 missing 처리
    rangeStart: visiblePeriod.start,
    rangeEnd: visiblePeriod.end,
  };
}

export function getClampedPeriodIsoRange(
  params: ISliceDailyTrendByPeriodParams,
): { startIso: string; endIso: string } | null {
  const visible = resolveVisiblePeriod(
    params.viewUnit,
    params.periodIndex,
    params.today,
  );
  const clamped = clampRangeToTimeline(
    visible,
    params.timelineStartDate,
    params.timelineEndDate,
  );
  if (!clamped) return null;
  return {
    startIso: toIsoDate(clamped.start),
    endIso: toIsoDate(clamped.end),
  };
}
