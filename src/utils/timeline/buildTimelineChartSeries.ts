import type {
  ITimelineDailyTrend,
  TTimelineMetric,
} from "@/types/timeline/api";
import { TIMELINE_METRIC_OPTIONS } from "@/constants/timeline/formOptions";

import { parseIsoDate } from "./period";

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

function toChartTimestamp(isoDate: string): number {
  return parseIsoDate(isoDate).getTime();
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

export interface ITimelineChartPoint {
  x: number;
  y: number;
}

export interface ITimelineChartSeriesItem {
  name: string;
  data: ITimelineChartPoint[];
}

export interface ITimelineChartSeriesResult {
  series: ITimelineChartSeriesItem[];
  yMax: number;
  xMin: number | undefined;
  xMax: number | undefined;
  metricLabel: string;
}

export function buildTimelineChartSeries(
  dailyTrend: ITimelineDailyTrend[],
  metric: TTimelineMetric,
): ITimelineChartSeriesResult {
  const metricLabel = getTimelineMetricLabel(metric);
  const points = dailyTrend.map((row) => ({
    x: toChartTimestamp(row.date),
    y: getMetricValueFromTrend(row, metric),
  }));
  const ys = points.map((p) => p.y);
  const xs = points.map((p) => p.x);

  return {
    series: [
      {
        name: metricLabel,
        data: points,
      },
    ],
    yMax: calcChartYMax(ys, metric === "ROAS"),
    xMin: xs.length > 0 ? Math.min(...xs) : undefined,
    xMax: xs.length > 0 ? Math.max(...xs) : undefined,
    metricLabel,
  };
}
