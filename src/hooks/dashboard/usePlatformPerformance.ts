import type { TProviderType } from "@/types/dashboard/overview";
import type {
  IPlatformPerformance,
  TPlatformProvider,
} from "@/types/dashboard/platform";

import { useCoreQuery } from "@/hooks/customQuery";

import { getOverview } from "@/api/dashboard/overview";
import useWorkspaceStore from "@/store/useWorkspaceStore";

// TODO: 추후 제거
const normalizeProvider = (provider: string): TPlatformProvider =>
  provider === "KAKAO" ? "META" : (provider as TPlatformProvider);

const PROVIDERS: TProviderType[] = ["GOOGLE", "NAVER", "KAKAO"];

// 플랫폼별 성과 효율 (3개 플랫폼 병렬 조회 후 병합)
export function usePlatformPerformance() {
  const orgId = useWorkspaceStore((s) => s.selectedOrgId);

  return useCoreQuery(
    ["platform", "performance", orgId],
    async (): Promise<IPlatformPerformance[]> => {
      const results = await Promise.all(
        PROVIDERS.map((provider) =>
          getOverview(orgId!, provider)
            .then((metrics) => ({
              ...metrics,
              provider: normalizeProvider(provider),
            }))
            .catch(() => null),
        ),
      );
      return results.filter((r): r is IPlatformPerformance => r !== null);
    },
    { enabled: !!orgId },
  );
}
