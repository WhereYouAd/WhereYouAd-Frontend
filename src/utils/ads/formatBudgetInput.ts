const BUDGET_INPUT_LOCALE = "ko-KR" as const;

/** 입력칸 표시 — 1000000 → "1,000,000" */
export function formatBudgetInputDisplay(value: number | undefined): string {
  if (value === undefined || Number.isNaN(value)) return "";
  return value.toLocaleString(BUDGET_INPUT_LOCALE);
}

/** 입력 파싱 — "1,000,000" / "1000000" → 1000000 */
export function parseBudgetInput(raw: string): number | undefined {
  const digits = extractBudgetInputDigits(raw);
  if (digits === "") return undefined;

  const parsed = Number(digits);
  if (!Number.isSafeInteger(parsed)) return undefined;

  return parsed;
}

/** 입력 중 표시 — 숫자만 허용 */
export function extractBudgetInputDigits(raw: string): string {
  return raw.replace(/\D/g, "");
}
