import type { TProviderType } from "@/types/dashboard/overview";
import type { IPlatformPerformance } from "@/types/dashboard/platform";

import { useCoreQuery } from "@/hooks/customQuery";

import { getOverview } from "@/api/dashboard/overview";
import useWorkspaceStore from "@/store/useWorkspaceStore";

const PROVIDERS: TProviderType[] = ["GOOGLE", "NAVER", "META"];

// 플랫폼별 성과 효율 (3개 플랫폼 병렬 조회 후 병합)
export function usePlatformPerformance() {
  const orgId = useWorkspaceStore((s) => s.selectedOrgId);

  return useCoreQuery(
    ["platform", "performance", orgId],
    async (): Promise<IPlatformPerformance[]> => {
      const settled = await Promise.allSettled(
        PROVIDERS.map((provider) =>
          getOverview(orgId!, provider).then((metrics) => ({
            ...metrics,
            provider,
          })),
        ),
      );

      const success = settled
        .filter(
          (r): r is PromiseFulfilledResult<IPlatformPerformance> =>
            r.status === "fulfilled",
        )
        .map((r) => r.value);

      if (success.length !== PROVIDERS.length) {
        throw new Error("일부 플랫폼 성과 데이터를 불러오지 못했습니다.");
      }
      return success;
    },
    { enabled: !!orgId },
  );
}
