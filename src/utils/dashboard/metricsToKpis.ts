import type { IMetricsResponse } from "@/types/dashboard/common";

import type { IStatCardProps } from "@/components/common/card/StatCard";

import {
  getKpiMetric,
  getMetricKpiTitle,
  OVERVIEW_KPI_BINDINGS,
} from "./metricRegistry";

/**
 * API 응답 → KPI StatCard Props 변환.
 * OVERVIEW_KPI_BINDINGS를 순회하며 각 항목의 registryKey로 포맷 함수를 조회하고,
 * valueField / deltaField로 응답 JSON에서 값을 꺼내 조합한다.
 */
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
