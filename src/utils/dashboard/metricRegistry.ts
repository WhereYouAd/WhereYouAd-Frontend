import type { IMetricsResponse } from "@/types/dashboard/common";

const METRIC_LOCALE = "ko-KR" as const;

function formatNumber(v: number): string {
  return v.toLocaleString(METRIC_LOCALE);
}

function formatCurrency(v: number): string {
  return `₩${formatNumber(v)}`;
}

function formatCurrencyRounded(v: number): string {
  return `₩${formatNumber(Math.round(v))}`;
}

const formatPercentDelta = (v: number) => `${Math.abs(v).toFixed(2)}%`;

/* 트래픽 차트 Y축 — 1,000 미만 locale, 이상 K 축약 */
export function formatCountChartAxis(val: number): string {
  const rounded = Math.round(val);
  if (rounded <= 0) return "";
  if (rounded < 1000) return formatNumber(rounded);
  return `${Math.round(rounded / 1000)}K`;
}

/* 트래픽 차트 툴팁 */
export function formatCountChartTooltip(val: number, unit?: string): string {
  const formatted = formatNumber(val);
  return unit ? `${formatted} ${unit}` : formatted;
}

/** 기본: 레이블 + 값 포맷 */
interface IMetricMeta {
  label: string;
  format: (v: number) => string;
}

/** 증감률(%) 포맷 포함 */
interface IMetricMetaWithDelta extends IMetricMeta {
  formatDelta: (v: number) => string;
}

/** KPI 카드용 — conversion만 kpiLabel로 카드 제목 분리 */
interface IKpiMetricMeta extends IMetricMetaWithDelta {
  kpiLabel: string;
}

interface IClicksMetricMeta extends IMetricMetaWithDelta {
  chartTooltipUnit: string;
}

const currencyFormat = { format: formatCurrency } satisfies Pick<
  IMetricMeta,
  "format"
>;

/**
 * Registry 키 = FE 내부 식별자.
 * label = 화면 표시명, format = 값 표시, formatDelta = 증감률 표시
 *
 * 포맷 기준:
 *   정수형 카운트  → 천 단위 콤마 (toLocaleString)
 *   비율/퍼센트   → toFixed(2)%
 *   금액 (KRW)   → Math.round + 천 단위 콤마 + ₩
 *   증감률        → toFixed(2)% + 절댓값
 */
export const METRIC_REGISTRY = {
  clicks: {
    label: "클릭수",
    chartTooltipUnit: "클릭",
    format: formatNumber,
    formatDelta: formatPercentDelta,
  } satisfies IClicksMetricMeta,

  impressions: {
    label: "노출수",
    format: formatNumber,
    formatDelta: formatPercentDelta,
  } satisfies IMetricMetaWithDelta,

  conversion: {
    label: "CVR(전환율)",
    kpiLabel: "전환율",
    format: (v) => `${v.toFixed(2)}%`,
    formatDelta: formatPercentDelta,
  } satisfies IKpiMetricMeta,

  roas: {
    label: "ROAS",
    format: (v) => `${v.toFixed(2)}%`,
    formatDelta: formatPercentDelta,
  } satisfies IMetricMetaWithDelta,

  spend: {
    label: "비용(지출)",
    ...currencyFormat,
  } satisfies IMetricMeta,

  ctr: {
    label: "CTR(클릭률)",
    format: (v) => `${v.toFixed(2)}%`,
    formatDelta: formatPercentDelta,
  } satisfies IMetricMetaWithDelta,

  cpa: {
    label: "CPA",
    format: formatCurrencyRounded,
  } satisfies IMetricMeta,

  conversions: {
    label: "전환 수",
    format: formatNumber,
  } satisfies IMetricMeta,

  revenue: {
    label: "매출",
    ...currencyFormat,
  } satisfies IMetricMeta,

  adSpend: {
    label: "광고비",
    ...currencyFormat,
  } satisfies IMetricMeta,
} as const;

/* KPI StatCard 4종 — metricsToKpis 전용 */
type TKpiMetricKey = "clicks" | "impressions" | "conversion" | "roas";

export function getKpiMetric(key: TKpiMetricKey): IMetricMetaWithDelta {
  return METRIC_REGISTRY[key];
}

type TMetricApiField = keyof IMetricsResponse;

/**
 * API 필드(getOverview) ↔ Registry 키 연결.
 * registryKey: 포맷·레이블, valueField/deltaField: 응답 JSON 필드명.
 */
interface IOverviewKpiBinding {
  registryKey: TKpiMetricKey;
  valueField: TMetricApiField;
  deltaField: TMetricApiField;
}

/** metricsToKpis가 순회 — 통합·단일·전체 보기 KPI 공통 */
export const OVERVIEW_KPI_BINDINGS: readonly IOverviewKpiBinding[] = [
  {
    registryKey: "clicks", // 어느 레지스트리 항목에서 포맷·label을 가져올지
    valueField: "clicks", // 응답에서 "값"을 꺼낼 필드명
    deltaField: "clickChangeRate", // 응답에서 "증감률"을 꺼낼 필드명
  },
  {
    registryKey: "impressions",
    valueField: "impressions",
    deltaField: "impressionChangeRate",
  },
  {
    registryKey: "conversion",
    valueField: "conversion",
    deltaField: "cvrChangeRate",
  },
  {
    registryKey: "roas",
    valueField: "ROAS",
    deltaField: "ROASChangeRate",
  },
];

/** KPI 카드 제목 — conversion만 kpiLabel 사용 */
export function getMetricKpiTitle(key: TKpiMetricKey): string {
  if (key === "conversion") {
    return METRIC_REGISTRY.conversion.kpiLabel;
  }
  return METRIC_REGISTRY[key].label;
}
