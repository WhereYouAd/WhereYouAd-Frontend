/* API 플랫폼 코드 목록 */
export const PROVIDER_TYPES = ["GOOGLE", "NAVER", "META"] as const;

/* 단일 플랫폼 (GOOGLE | NAVER | META) */
export type TProviderType = (typeof PROVIDER_TYPES)[number];

/* AI 분석용 — 플랫폼 하나 또는 통합(ALL) */
export type TAiAnalysisProvider = TProviderType | "ALL";

/* ROAS 순위 항목 */
export interface IRoasRanking {
  rank: number;
  provider: string;
  roas: number;
  diffRate: number | null;
  revenue: number;
  adSpend: number;
}

/* 화면에 보이는 이름 */
export const PLATFORM_MAP: Record<TProviderType, string> = {
  GOOGLE: "Google",
  NAVER: "NAVER",
  META: "Meta",
};

/* 차트 범례·시리즈 색 */
export const PLATFORM_CHART_COLORS: Record<TProviderType, string> = {
  GOOGLE: "var(--color-platform-google)",
  NAVER: "var(--color-oauth-naver)",
  META: "var(--color-platform-meta)",
};
