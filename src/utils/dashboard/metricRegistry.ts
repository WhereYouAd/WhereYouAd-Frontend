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

/** KPI·통합 대시보드 트렌드 — 소수 2자리 */
const formatPercentDelta = (v: number) => `${Math.abs(v).toFixed(2)}%`;

/** 플랫폼 카드·랭킹 테이블 트렌드 — 소수 1자리 */
export const formatPercentDeltaCompact = (v: number) =>
  `${Math.abs(v).toFixed(1)}%`;

/** 트래픽 차트 Y축 — 1,000 미만 locale, 이상 K 축약 */
export function formatCountChartAxis(val: number): string {
  const rounded = Math.round(val);
  if (rounded <= 0) return "";
  if (rounded < 1000) return formatNumber(rounded);
  return `${Math.round(rounded / 1000)}K`;
}

/** 트래픽 차트 툴팁 — unit 생략 시 숫자만 */
export function formatCountChartTooltip(val: number, unit?: string): string {
  const formatted = formatNumber(val);
  return unit ? `${formatted} ${unit}` : formatted;
}

interface IMetricMeta {
  label: string;
  format: (v: number) => string;
}

interface IMetricMetaWithDelta extends IMetricMeta {
  formatDelta: (v: number) => string;
}

interface IKpiMetricMeta extends IMetricMetaWithDelta {
  kpiLabel: string;
}

interface IConversionMetricMeta extends IKpiMetricMeta {
  formatCard: (v: number) => string;
  formatCompact: (v: number) => string;
  formatDeltaCompact: (v: number) => string;
}

interface IRoasMetricMeta extends IMetricMetaWithDelta {
  formatGrouped: (v: number) => string;
  formatTableTotal: (v: number) => string;
  formatTableRow: (v: number) => string;
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
    formatCard: (v) => `${v}%`,
    formatCompact: (v) => `${v.toFixed(1)}%`,
    formatDelta: formatPercentDelta,
    formatDeltaCompact: formatPercentDeltaCompact,
  } satisfies IConversionMetricMeta,

  roas: {
    label: "ROAS",
    format: (v) => `${v.toFixed(2)}%`,
    formatGrouped: (v) => `${formatNumber(v)}%`,
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

type TKpiMetricKey = "clicks" | "impressions" | "conversion" | "roas";

export function getKpiMetric(key: TKpiMetricKey): IMetricMetaWithDelta {
  return METRIC_REGISTRY[key];
}

type TMetricApiField = keyof IMetricsResponse;

interface IOverviewKpiBinding {
  registryKey: TKpiMetricKey;
  valueField: TMetricApiField;
  deltaField: TMetricApiField;
}

/** 통합·플랫폼 KPI StatCard 구성 */
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

export function getMetricKpiTitle(key: TKpiMetricKey): string {
  if (key === "conversion") {
    return METRIC_REGISTRY.conversion.kpiLabel;
  }
  return METRIC_REGISTRY[key].label;
}
