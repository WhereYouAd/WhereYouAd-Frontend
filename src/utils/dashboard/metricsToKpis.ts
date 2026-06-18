import type { IMetricsResponse } from "@/types/dashboard/common";

import type { IStatCardProps } from "@/components/common/card/StatCard";

const toRate = (rate: number) => `${Math.abs(rate).toFixed(2)}%`;

export function metricsToKpis(metrics: IMetricsResponse): IStatCardProps[] {
  return [
    {
      title: "클릭수",
      value: metrics.clicks.toLocaleString(),
      trend: {
        direction: metrics.clickChangeRate >= 0 ? "up" : "down",
        value: toRate(metrics.clickChangeRate),
      },
    },
    {
      title: "노출수",
      value: metrics.impressions.toLocaleString(),
      trend: {
        direction: metrics.impressionChangeRate >= 0 ? "up" : "down",
        value: toRate(metrics.impressionChangeRate),
      },
    },
    {
      title: "전환율",
      value: `${metrics.conversion.toFixed(2)}%`,
      trend: {
        direction: metrics.cvrChangeRate >= 0 ? "up" : "down",
        value: toRate(metrics.cvrChangeRate),
      },
    },
    {
      title: "ROAS",
      value: `${metrics.ROAS.toFixed(2)}%`,
      trend: {
        direction: metrics.ROASChangeRate >= 0 ? "up" : "down",
        value: toRate(metrics.ROASChangeRate),
      },
    },
  ];
}
