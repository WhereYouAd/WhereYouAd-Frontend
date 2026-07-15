import type { ITimelineDailyTrend } from "@/types/timeline/api";

import { startOfDay, toIsoDate } from "./period";

export type TFilledDailyTrendRow =
  | ITimelineDailyTrend
  | { date: string; missing: true };

export function isMissingDailyTrendRow(
  row: TFilledDailyTrendRow,
): row is { date: string; missing: true } {
  return "missing" in row && row.missing;
}

export function enumerateIsoDates(start: Date, end: Date): string[] {
  const dates: string[] = [];
  const cur = startOfDay(start);
  const last = startOfDay(end);

  while (cur.getTime() <= last.getTime()) {
    dates.push(toIsoDate(cur));
    cur.setDate(cur.getDate() + 1);
  }

  return dates;
}

/*선택 구간의 모든 날짜 채우기 (차트에서는 null로 그려 가짜 0을 피함)*/
export function fillDailyTrendRange(
  dailyTrend: ITimelineDailyTrend[],
  rangeStart: Date,
  rangeEnd: Date,
): TFilledDailyTrendRow[] {
  const byDate = new Map(dailyTrend.map((row) => [row.date, row]));

  return enumerateIsoDates(rangeStart, rangeEnd).map((date) => {
    const row = byDate.get(date);
    if (row) return row;
    return { date, missing: true };
  });
}
