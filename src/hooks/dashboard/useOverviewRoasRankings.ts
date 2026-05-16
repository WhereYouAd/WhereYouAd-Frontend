import type {
  IPlatformRankingItem,
  TProviderType,
} from "@/types/dashboard/overview";

import { useCoreQuery } from "@/hooks/customQuery";

import { getOverview, getRoasRankings } from "@/api/dashboard/overview";
import useWorkspaceStore from "@/store/useWorkspaceStore";

const PROVIDERS: TProviderType[] = ["GOOGLE", "NAVER", "META"];

export function useOverviewRoasRankings() {
  const orgId = useWorkspaceStore((s) => s.selectedOrgId);

  return useCoreQuery(
    ["overview", "roasRankings", orgId],
    async (): Promise<IPlatformRankingItem[]> => {
      // ROAS 순위 + 플랫폼별 지표 병렬 조회
      const [rankingsRes, ...metricsResults] = await Promise.all([
        // TODO: 백엔드 빈 배열 이슈 — 임시 날짜 범위
        getRoasRankings(orgId!, {
          startDate: "2026-01-22",
          endDate: "2026-03-22",
        }),
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
