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

/* KPI StatCard 트렌드 — 소수 2자리 */
const formatPercentDelta = (v: number) => `${Math.abs(v).toFixed(2)}%`;

/* 테이블·좁은 영역 트렌드 — 소수 1자리 */
const formatPercentDeltaCompact = (v: number) => `${Math.abs(v).toFixed(1)}%`;

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

interface IConversionMetricMeta extends IKpiMetricMeta {
  formatCompact: (v: number) => string; // 테이블 등 — 소수 1자리
}

interface IRoasMetricMeta extends IMetricMetaWithDelta {
  formatTableTotal: (v: number) => string; // 일별 테이블 합계 행
  formatTableRow: (v: number) => string; // 일별 테이블 데이터 행
}

interface ICtrMetricMeta extends IMetricMetaWithDelta {
  formatCompact: (v: number) => string;
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
 * label = 화면 표시명, format* = 컨텍스트별 표시 규칙
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
    label: "CVR(전환율)", // 테이블·차트
    kpiLabel: "전환율", // KPI 카드 제목
    format: (v) => `${v.toFixed(2)}%`,
    formatCompact: (v) => `${v.toFixed(1)}%`,
    formatDelta: formatPercentDelta,
  } satisfies IConversionMetricMeta,

  roas: {
    label: "ROAS",
    format: (v) => `${v.toFixed(2)}%`, // KPI·순위
    formatTableTotal: (v) => `${Math.round(v)}%`,
    formatTableRow: (v) => `${v}%`,
    formatDelta: formatPercentDelta,
  } satisfies IRoasMetricMeta,

  spend: {
    label: "비용(지출)",
    ...currencyFormat,
  } satisfies IMetricMeta,

  ctr: {
    label: "CTR(클릭률)",
    format: (v) => `${v.toFixed(2)}%`,
    formatCompact: (v) => `${v.toFixed(1)}%`,
    formatDelta: formatPercentDeltaCompact,
  } satisfies ICtrMetricMeta,

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
    registryKey: "clicks",
    valueField: "clicks",
    deltaField: "clickChangeRate",
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
