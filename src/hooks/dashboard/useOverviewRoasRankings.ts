import type {
  IPlatformRankingItem,
  TProviderType,
} from "@/types/dashboard/overview";

import { useCoreQuery } from "@/hooks/customQuery";

import { getOverview, getRoasRankings } from "@/api/dashboard/overview";
import useWorkspaceStore from "@/store/useWorkspaceStore";

const PROVIDERS: TProviderType[] = ["GOOGLE", "NAVER", "KAKAO"];

// 플랫폼별 ROAS 순위 + CTR/CVR 지표 병렬 조회 후 병합
export function useOverviewRoasRankings() {
  const orgId = useWorkspaceStore((s) => s.selectedOrgId);

  return useCoreQuery(
    ["overview", "roasRankings", orgId],
    async (): Promise<IPlatformRankingItem[]> => {
      // ROAS 순위 + 각 플랫폼 지표 병렬 호출
      const [rankingsRes, ...metricsResults] = await Promise.all([
        getRoasRankings(orgId!),
        ...PROVIDERS.map((p) => getOverview(orgId!, p).catch(() => null)),
      ]);

      const metricsMap = Object.fromEntries(
        PROVIDERS.map((p, i) => [p, metricsResults[i]]),
      );

      return rankingsRes.rankings.map((item) => {
        const metrics = metricsMap[item.provider.toUpperCase()];
        // CTR = 클릭수 / 노출수 * 100
        const clickRate =
          metrics && metrics.impressions > 0
            ? (metrics.clicks / metrics.impressions) * 100
            : undefined;

        return {
          ...item,
          clickRate,
          ctrDelta: metrics ? metrics.clickChangeRate * 100 : undefined,
          conversionRate: metrics ? metrics.conversion * 100 : undefined,
          conversionDelta: metrics ? metrics.cvrChangeRate * 100 : undefined,
        };
      });
    },
    { enabled: !!orgId },
  );
}
