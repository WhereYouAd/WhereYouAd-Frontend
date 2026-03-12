export interface IPlatformStats {
  name: "Google" | "NAVER" | "Kakao";
  clickRate: number; // 클릭률 (%)
  ctrDelta: number; // 전일 대비 CTR 증감 (%)
  conversionRate: number; // 전환률 (%)
  conversionDelta: number; // 전일 대비 전환율 증감 (%)
  impressionRate: number; // 노출수 (%) — 바 차트 제거 후에도 타입 유지
  roas: number; // ROAS (%)
  revenue: number; // 매출 (원)
  adCost: number; // 광고비 (원)
}

export const platformComparisonMock: IPlatformStats[] = [
  {
    name: "Google",
    clickRate: 45,
    ctrDelta: 2.3,
    conversionRate: 50,
    conversionDelta: 1.1,
    impressionRate: 62,
    roas: 320,
    revenue: 12300000,
    adCost: 3840000,
  },
  {
    name: "NAVER",
    clickRate: 42,
    ctrDelta: -1.2,
    conversionRate: 55,
    conversionDelta: 0.8,
    impressionRate: 65,
    roas: 210,
    revenue: 9100000,
    adCost: 4330000,
  },
  {
    name: "Kakao",
    clickRate: 40,
    ctrDelta: 0.5,
    conversionRate: 48,
    conversionDelta: -0.3,
    impressionRate: 60,
    roas: 95,
    revenue: 2300000,
    adCost: 2420000,
  },
];

// ROAS 기준 내림차순 정렬
export const platformRoasRanking = [...platformComparisonMock].sort(
  (a, b) => b.roas - a.roas,
);
