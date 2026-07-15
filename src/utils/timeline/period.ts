import type { TTimelineViewUnit } from "@/types/timeline/ui";

export interface ITimelineVisiblePeriod {
  start: Date;
  end: Date;
  periodLabel: string;
}

export function parseIsoDate(iso: string): Date {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function toIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function formatShortDate(iso: string): string {
  const [, month, day] = iso.split("-");
  return `${month}.${day}`;
}

export function formatRange(startIso: string, endIso: string): string {
  return `${formatShortDate(startIso)} - ${formatShortDate(endIso)}`;
}

export function formatDot(iso: string): string {
  const [year, month, day] = iso.split("-");
  return `${year}.${month}.${day}`;
}

function getWeekStart(date: Date): Date {
  const d = startOfDay(date);
  d.setDate(d.getDate() - d.getDay());
  return d;
}

function formatDayLabel(date: Date, today: Date): string {
  if (startOfDay(date).getTime() === startOfDay(today).getTime()) {
    return "오늘";
  }
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
}

function formatWeekLabel(start: Date, end: Date): string {
  const startLabel = `${start.getMonth() + 1}월 ${start.getDate()}일`;
  const endLabel = `${end.getMonth() + 1}월 ${end.getDate()}일`;

  return `${startLabel} - ${endLabel}`;
}

function formatMonthLabel(date: Date): string {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
}

/*viewUnit + periodLabel이 이번이 화면에 보여줄 날짜 범위 */
export function resolveVisiblePeriod(
  viewUnit: TTimelineViewUnit,
  periodIndex: number,
  today = new Date(),
): ITimelineVisiblePeriod {
  const normalizedToday = startOfDay(today);

  if (viewUnit === "DAY") {
    const start = new Date(normalizedToday);
    start.setDate(start.getDate() - periodIndex);

    return {
      start,
      end: new Date(start),
      periodLabel: formatDayLabel(start, normalizedToday),
    };
  }
  if (viewUnit === "WEEK") {
    const weekStart = getWeekStart(normalizedToday);
    weekStart.setDate(weekStart.getDate() - periodIndex * 7);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    return {
      start: weekStart,
      end: weekEnd,
      periodLabel:
        periodIndex === 0 &&
        weekStart <= normalizedToday &&
        normalizedToday <= weekEnd
          ? "이번 주"
          : formatWeekLabel(weekStart, weekEnd),
    };
  }
  //Month
  const anchor = new Date(
    normalizedToday.getFullYear(),
    normalizedToday.getMonth() - periodIndex,
    1,
  );

  const start = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
  const end = new Date(anchor.getFullYear(), anchor.getMonth() + 1, 0);

  return {
    start,
    end,
    periodLabel:
      periodIndex === 0 ? formatMonthLabel(start) : formatMonthLabel(start),
  };
}
