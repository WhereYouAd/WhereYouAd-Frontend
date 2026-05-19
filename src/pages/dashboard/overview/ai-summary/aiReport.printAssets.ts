import serviceLogoSvg from "@/assets/logo/service-logo/logo.svg?raw";

/** iframe 인쇄용 — SVGR 대신 인라인 SVG (SSR·PDF에서 경로/컴포넌트 누락 방지) */
export const AI_REPORT_LOGO_PRINT_SVG = serviceLogoSvg
  .replace(/fill="#2f5bea"/gi, 'fill="currentColor"')
  .replace(
    "<svg ",
    '<svg aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid meet" ',
  );

/** aiReport.print.css에서 사용하는 @theme 색상 (별칭 + 원본 스케일) */
const THEME_VARS_FOR_PRINT = [
  "--color-text-100",
  "--color-text-200",
  "--color-text-300",
  "--color-text-400",
  "--color-text-title",
  "--color-text-body",
  "--color-text-muted",
  "--color-surface-100",
  "--color-surface-200",
  "--color-surface-300",
  "--color-surface-400",
  "--color-primary-500",
] as const;

const VAR_REFERENCE_RE = /^var\(\s*(--[^),\s]+)/;

function resolveThemeVarValue(name: string): string {
  const root = getComputedStyle(document.documentElement);
  let value = root.getPropertyValue(name).trim();
  let depth = 0;

  while (value.startsWith("var(") && depth < 6) {
    const ref = value.match(VAR_REFERENCE_RE)?.[1];
    if (!ref) break;
    value = root.getPropertyValue(ref).trim();
    depth += 1;
  }

  return value;
}

/** 메인 문서 @theme 값을 iframe :root에 실제 색 값으로 복사 */
export function buildPrintThemeStyleBlock(): string {
  const declarations = THEME_VARS_FOR_PRINT.map((name) => {
    const value = resolveThemeVarValue(name);
    return value ? `${name}: ${value};` : null;
  })
    .filter(Boolean)
    .join(" ");

  return declarations ? `:root { ${declarations} }` : "";
}
