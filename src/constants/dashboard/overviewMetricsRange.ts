/** 통합 대시보드 — 일별 지표 ROAS 순위 등 */
export const OVERVIEW_DAILY_METRICS_RANGE = {
  startDate: "2026-06-15",
  endDate: "2026-07-07",
} as const;

/**
 * AI 분석 — ROAS 동일 구간 말일 기준 최근 14일(2주), 구간 시작일 이전으로는 확장하지 않음
 * 백엔드 확인 결과 조회 기간이 너무 길면(예: 30일) AI 처리 단계에서 실패해 1~2주 범위로 제한
 */
const AI_ANALYSIS_LOOKBACK_DAYS = 14;

function toApiDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function parseApiDate(dateStr: string): Date {
  return new Date(`${dateStr}T12:00:00`);
}

/** AI 요약 POST body용 — 통합 ROAS 말일 기준 최근 2주 */
export function getAiAnalysisDateRange(): {
  startDate: string;
  endDate: string;
} {
  const { startDate: rangeStart, endDate: rangeEnd } =
    OVERVIEW_DAILY_METRICS_RANGE;

  const end = parseApiDate(rangeEnd);
  const start = new Date(end);
  start.setDate(start.getDate() - (AI_ANALYSIS_LOOKBACK_DAYS - 1));

  const computedStart = toApiDateString(start);

  return {
    startDate: computedStart < rangeStart ? rangeStart : computedStart,
    endDate: rangeEnd,
  };
}

/** AI 카드·UI용 분석 기간 표시 */
export function formatAiAnalysisPeriodLabel(
  range: { startDate: string; endDate: string } = getAiAnalysisDateRange(),
): string {
  const toDisplay = (value: string) => value.replaceAll("-", ".");
  return `분석 기준 ${toDisplay(range.startDate)} ~ ${toDisplay(range.endDate)}`;
}
