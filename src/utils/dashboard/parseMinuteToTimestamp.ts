export function parseMinuteToTimestamp(minute: string): number {
  if (!/^\d{12}$/.test(minute)) return Number.NaN;

  const year = parseInt(minute.slice(0, 4), 10);
  const month = parseInt(minute.slice(4, 6), 10);
  const day = parseInt(minute.slice(6, 8), 10);
  const hour = parseInt(minute.slice(8, 10), 10);
  const min = parseInt(minute.slice(10, 12), 10);

  if (month < 1 || month > 12) return Number.NaN;
  if (day < 1 || day > 31) return Number.NaN;
  if (hour > 23) return Number.NaN;
  if (min > 59) return Number.NaN;

  return new Date(year, month - 1, day, hour, min).getTime();
}
