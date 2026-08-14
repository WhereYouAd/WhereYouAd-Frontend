import type {
  IPlatformPerformance,
  IPlatformPerformanceQueryData,
} from "@/types/dashboard/platform";
import { PROVIDER_TYPES, type TProviderType } from "@/types/dashboard/provider";

import { fetchPlatformMetrics } from "@/utils/dashboard/platformMetricsQuery";

import { useCoreQuery } from "@/hooks/customQuery";

import { QUERY_KEYS } from "@/lib/queryKeys";
import useWorkspaceStore from "@/store/useWorkspaceStore";

const PROVIDERS: readonly TProviderType[] = PROVIDER_TYPES;

// 플랫폼별 성과 효율 (3개 플랫폼 병렬 조회 후 병합 — 부분 실패 허용)
export function usePlatformPerformance() {
  const orgId = useWorkspaceStore((s) => s.selectedOrgId);

  return useCoreQuery(
    QUERY_KEYS.platform.performance(orgId),
    async (): Promise<IPlatformPerformanceQueryData> => {
      const settled = await Promise.allSettled(
        PROVIDERS.map((provider) =>
          fetchPlatformMetrics(orgId!, provider).then((metrics) => ({
            ...metrics,
            provider,
          })),
        ),
      );

      const platforms: IPlatformPerformance[] = [];
      const failedProviders: TProviderType[] = [];

      settled.forEach((result, index) => {
        const provider = PROVIDERS[index];
        if (result.status === "fulfilled") {
          platforms.push(result.value);
        } else {
          failedProviders.push(provider);
        }
      });

      if (platforms.length === 0) {
        throw new Error("플랫폼 성과 데이터를 불러오지 못했습니다.");
      }

      return { platforms, failedProviders };
    },
    { enabled: !!orgId },
  );
}
