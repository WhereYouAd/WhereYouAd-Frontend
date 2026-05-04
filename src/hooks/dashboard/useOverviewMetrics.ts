import type { IMetricsResponse } from "@/types/dashboard/overview";

import { useCoreQuery } from "@/hooks/customQuery";

import type { IStatCardProps } from "@/components/common/card/StatCard";

import { getOverview } from "@/api/dashboard/overview";
import useWorkspaceStore from "@/store/useWorkspaceStore";

// 변화율 퍼센트 문자열로 변환
const toRate = (rate: number) => `${Math.abs(rate).toFixed(1)}%`;

// API 응답 KPI 카드 형식으로 변환
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
      value: `${metrics.conversion.toFixed(1)}%`,
      trend: {
        direction: metrics.cvrChangeRate >= 0 ? "up" : "down",
        value: toRate(metrics.cvrChangeRate),
      },
    },
    {
      title: "ROAS",
      value: `${metrics.ROAS.toFixed(1)}%`,
      trend: {
        direction: metrics.ROASChangeRate >= 0 ? "up" : "down",
        value: toRate(metrics.ROASChangeRate),
      },
    },
  ];
}

// 통합 지표 조회
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
