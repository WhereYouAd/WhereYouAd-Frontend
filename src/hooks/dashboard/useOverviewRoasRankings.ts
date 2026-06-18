import type { IPlatformRankingItem } from "@/types/dashboard/overview";
import { PROVIDER_TYPES, type TProviderType } from "@/types/dashboard/provider";
import { OVERVIEW_DAILY_METRICS_RANGE } from "@/constants/dashboard/overviewMetricsRange";

import { useCoreQuery } from "@/hooks/customQuery";

import { getOverview, getRoasRankings } from "@/api/dashboard/overview";
import { QUERY_KEYS } from "@/lib/queryKeys";
import useWorkspaceStore from "@/store/useWorkspaceStore";

const PROVIDERS: readonly TProviderType[] = PROVIDER_TYPES;

export function useOverviewRoasRankings() {
  const orgId = useWorkspaceStore((s) => s.selectedOrgId);

  return useCoreQuery(
    QUERY_KEYS.overview.roasRankings(orgId),
    async (): Promise<IPlatformRankingItem[]> => {
      // ROAS 순위 + 플랫폼별 지표 병렬 조회
      const [rankingsRes, ...metricsResults] = await Promise.all([
        getRoasRankings(orgId!, OVERVIEW_DAILY_METRICS_RANGE),
        ...PROVIDERS.map((p) => getOverview(orgId!, p).catch(() => null)),
      ]);

      // provider → metrics 매핑
      const metricsMap = Object.fromEntries(
        PROVIDERS.map((p, i) => [p, metricsResults[i]]),
      );

      return rankingsRes.rankings.map((item) => {
        const metrics = metricsMap[item.provider.toUpperCase()];
        // CTR = 클릭수 ÷ 노출수 × 100
        const clickRate =
          metrics && metrics.impressions > 0
            ? (metrics.clicks / metrics.impressions) * 100
            : undefined;

        return {
          ...item,
          clickRate,
          ctrDelta: metrics ? metrics.clickChangeRate : undefined,
          conversionRate: metrics ? metrics.conversion : undefined,
          conversionDelta: metrics ? metrics.cvrChangeRate : undefined,
        };
      });
    },
    { enabled: !!orgId },
  );
}
