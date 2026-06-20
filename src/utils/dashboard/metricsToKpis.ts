import type { IMetricsResponse } from "@/types/dashboard/common";

import type { IStatCardProps } from "@/components/common/card/StatCard";

import {
  getKpiMetric,
  getMetricKpiTitle,
  OVERVIEW_KPI_BINDINGS,
} from "./metricRegistry";

export function metricsToKpis(metrics: IMetricsResponse): IStatCardProps[] {
  return OVERVIEW_KPI_BINDINGS.map(
    ({ registryKey, valueField, deltaField }) => {
      const metric = getKpiMetric(registryKey);

      return {
        title: getMetricKpiTitle(registryKey),
        value: metric.format(metrics[valueField]),
        trend: {
          direction: metrics[deltaField] >= 0 ? "up" : "down",
          value: metric.formatDelta(metrics[deltaField]),
        },
      };
    },
  );
}
