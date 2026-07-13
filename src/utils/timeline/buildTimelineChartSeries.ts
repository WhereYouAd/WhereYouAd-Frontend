import type {
  ITimelineDailyTrend,
  TTimelineMetric,
} from "@/types/timeline/api";
import { TIMELINE_METRIC_OPTIONS } from "@/constants/timeline/formOptions";

import {
  isMissingDailyTrendRow,
  type TFilledDailyTrendRow,
} from "./fillDailyTrendRange";

const METRIC_FIELD_MAP: Record<
  TTimelineMetric,
  keyof Pick<
    ITimelineDailyTrend,
    "clicks" | "conversions" | "impressions" | "roas"
  >
> = {
  CLICK: "clicks",
  CONVERSION: "conversions",
  IMPRESSION: "impressions",
  ROAS: "roas",
};

export function getTimelineMetricLabel(metric: TTimelineMetric): string {
  return (
    TIMELINE_METRIC_OPTIONS.find((option) => option.value === metric)?.label ??
    metric
  );
}

export function getMetricValueFromTrend(
  row: ITimelineDailyTrend,
  metric: TTimelineMetric,
): number {
  return row[METRIC_FIELD_MAP[metric]];
}

export function calcChartYMax(values: number[], isRoas: boolean): number {
  const max = values.length > 0 ? Math.max(...values) : 0;

  if (isRoas) {
    if (max <= 0) return 1;
    //ROAS는 소스 스케일 -> 0.5단위로 올림 + 20%여유
    const padded = max * 1.2;
    return Math.ceil(padded * 2) / 2;
  }

  if (max <= 0) return 1000;
  const magnitude = Math.pow(10, Math.floor(Math.log10(max)));
  const unit = magnitude >= 1 ? magnitude : 1;
  return Math.ceil((max * 1.2) / unit) * unit;
}

function formatCategoryLabel(isoDate: string): string {
  const [, month, day] = isoDate.split("-");
  return `${Number(month)}/${Number(day)}`;
}

export interface ITimelineChartSeriesItem {
  name: string;
  data: (number | null)[];
}

export interface ITimelineChartSeriesResult {
  series: ITimelineChartSeriesItem[];
  categories: string[];
  yMax: number;
  metricLabel: string;
  /** null이 아닌 실제 값 개수 (단일 점 마커 표시용) */
  pointCount: number;
}

/*missing 날짜는 null로 해서 선이 끊기고 ROAS에 가짜 0을 넣지 않음 */
export function buildTimelineChartSeries(
  filledRows: readonly TFilledDailyTrendRow[],
  metric: TTimelineMetric,
): ITimelineChartSeriesResult {
  const metricLabel = getTimelineMetricLabel(metric);

  const categories = filledRows.map((row) => formatCategoryLabel(row.date));
  const data = filledRows.map((row) => {
    if (isMissingDailyTrendRow(row)) return null;
    return getMetricValueFromTrend(row, metric);
  });

  const numericValues = data.filter((value): value is number => value != null);

  return {
    series: [
      {
        name: metricLabel,
        data,
      },
    ],
    categories,
    yMax: calcChartYMax(numericValues, metric === "ROAS"),
    metricLabel,
    pointCount: numericValues.length,
  };
}
