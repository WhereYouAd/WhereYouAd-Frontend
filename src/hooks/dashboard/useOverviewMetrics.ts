import type { IMetricsResponse } from "@/types/dashboard/overview";

import { useCoreQuery } from "@/hooks/customQuery";

import type { IStatCardProps } from "@/components/common/card/StatCard";

import { getOverview } from "@/api/dashboard/overview";
import useWorkspaceStore from "@/store/useWorkspaceStore";

const toRate = (rate: number) => `${(Math.abs(rate) * 100).toFixed(1)}%`;

function toKpis(metrics: IMetricsResponse): IStatCardProps[] {
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
      value: `${(metrics.conversion * 100).toFixed(1)}%`,
      trend: {
        direction: metrics.cvrChangeRate >= 0 ? "up" : "down",
        value: toRate(metrics.cvrChangeRate),
      },
    },
    {
      title: "ROAS",
      value: `${(metrics.ROAS * 100).toFixed(1)}%`,
      trend: {
        direction: metrics.ROASChangeRate >= 0 ? "up" : "down",
        value: toRate(metrics.ROASChangeRate),
      },
    },
  ];
}

export function useOverviewMetrics() {
  const orgId = useWorkspaceStore((s) => s.selectedOrgId);

  return useCoreQuery(
    ["overview", "metrics", orgId],
    () => getOverview(orgId!),
    {
      enabled: !!orgId,
      select: toKpis,
    },
  );
}
