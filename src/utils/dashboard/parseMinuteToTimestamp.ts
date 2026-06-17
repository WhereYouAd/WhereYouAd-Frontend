// 문자열을 로컬 타임스탬프로 변환
export function parseMinuteToTimestamp(minute: string): number {
  const year = parseInt(minute.slice(0, 4), 10);
  const month = parseInt(minute.slice(4, 6), 10) - 1;
  const day = parseInt(minute.slice(6, 8), 10);
  const hour = parseInt(minute.slice(8, 10), 10);
  const min = parseInt(minute.slice(10, 12), 10);
  return new Date(year, month, day, hour, min).getTime();
}
