/* 광고 플랫폼 API */
export const PROVIDER_TYPES = ["GOOGLE", "NAVER", "META"] as const;
export type TProviderType = (typeof PROVIDER_TYPES)[number];

/* AI 분석 요청용 — 단일 플랫폼 + ALL */
export type TAiAnalysisProvider = TProviderType | "ALL";
