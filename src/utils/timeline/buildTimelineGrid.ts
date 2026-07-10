import type { ITimelineListItem } from "@/types/timeline/api";
import type {
  ITimelineCampaignBar,
  ITimelineGridColumn,
  ITimelineGridData,
  TTimelineViewUnit,
} from "@/types/timeline/ui";
import { resolveTimelinePerformanceStatus } from "@/constants/timeline/statusStyle";

import {
  formatRange,
  parseIsoDate,
  resolveVisiblePeriod,
  startOfDay,
  toIsoDate,
} from "./period";

const WEEKDAY = ["일", "월", "화", "수", "목", "금", "토"] as const;

interface IBuildTimelineGridParams {
  items: ITimelineListItem[];
  viewUnit: TTimelineViewUnit;
  periodIndex: number;
}

/** visibleStart ~ visibleEnd 사이 하루마다 column 1칸 생성 */
function buildColumns(
  start: Date,
  end: Date,
  today: Date,
): ITimelineGridColumn[] {
  const columns: ITimelineGridColumn[] = [];
  const cursor = startOfDay(start);
  const endDay = startOfDay(end);
  const todayDay = startOfDay(today);

  while (cursor.getTime() <= endDay.getTime()) {
    const dayIndex = cursor.getDay();

    columns.push({
      day: WEEKDAY[dayIndex],
      date: cursor.getDate(),
      isWeekend: dayIndex === 0 || dayIndex === 6,
      isToday: cursor.getTime() === todayDay.getTime(),
      isoDate: toIsoDate(cursor),
    });

    cursor.setDate(cursor.getDate() + 1);
  }

  return columns;
}

/** date가 min~max 범위를 벗어나면 잘라냄 */
function clampDate(date: Date, min: Date, max: Date): Date {
  const time = startOfDay(date).getTime();
  const minTime = startOfDay(min).getTime();
  const maxTime = startOfDay(max).getTime();

  if (time < minTime) return startOfDay(min);
  if (time > maxTime) return startOfDay(max);
  return startOfDay(date);
}

/** columns에서 해당 날짜가 몇 번째 칸인지 (1-based) */
function findColumnIndex(columns: ITimelineGridColumn[], date: Date): number {
  const iso = toIsoDate(startOfDay(date));
  const index = columns.findIndex((column) => column.isoDate === iso);

  // 못 찾으면 1번 칸 (방어 코드)
  return index >= 0 ? index + 1 : 1;
}

/** 목록 item → 그리드 bar */
function layoutBars(
  items: ITimelineListItem[],
  columns: ITimelineGridColumn[],
  visibleStart: Date,
  visibleEnd: Date,
): ITimelineCampaignBar[] {
  const bars: ITimelineCampaignBar[] = [];
  let row = 1;

  for (const item of items) {
    const itemStart = parseIsoDate(item.startDate);
    const itemEnd = parseIsoDate(item.endDate);

    // 화면 기간과 안 겹치면 그리지 않음
    if (itemEnd < visibleStart || itemStart > visibleEnd) {
      continue;
    }

    const barStart = clampDate(itemStart, visibleStart, visibleEnd);
    const barEnd = clampDate(itemEnd, visibleStart, visibleEnd);

    const colStart = findColumnIndex(columns, barStart);
    const colEnd = findColumnIndex(columns, barEnd) + 1;

    bars.push({
      id: item.timelineId,
      title: item.name,
      subtitle: formatRange(item.startDate, item.endDate),
      performanceStatus: resolveTimelinePerformanceStatus(
        item.performanceStatus,
      ),
      colStart,
      colEnd,
      row,
    });

    row += 1;
  }

  return bars;
}

/** 목록 API 결과 → Timeline.tsx가 쓰는 gridData */
export function buildTimelineGrid({
  items,
  viewUnit,
  periodIndex,
}: IBuildTimelineGridParams): ITimelineGridData {
  const today = new Date();
  const { start, end, periodLabel } = resolveVisiblePeriod(
    viewUnit,
    periodIndex,
    today,
  );

  const columns = buildColumns(start, end, today);
  const bars = layoutBars(items, columns, start, end);

  return {
    viewUnit,
    periodLabel,
    columns,
    bars,
  };
}
