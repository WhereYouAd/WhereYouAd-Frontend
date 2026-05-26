/** AI 리포트 본문·PDF 공통 텍스트 처리 */

export function splitParagraphs(text: string) {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function ensureStringList(items: string[] | null | undefined): string[] {
  return Array.isArray(items) ? items : [];
}

/** 카드 표시용 — 번호 목록을 한 문자열로 */
export function formatNumberedList(items: string[] | null | undefined) {
  const lines = ensureStringList(items)
    .map((item) => item.trim())
    .filter(Boolean);
  if (!lines.length) return "—";
  return lines.map((line, index) => `${index + 1}. ${line}`).join("\n");
}

/** PDF·인쇄용 — 번호 목록을 문단 배열로 */
export function numberedParagraphs(items: string[] | null | undefined) {
  const lines = ensureStringList(items)
    .map((item) => item.trim())
    .filter(Boolean);
  if (!lines.length) return ["—"];
  return lines.map((line, index) => `${index + 1}. ${line}`);
}
