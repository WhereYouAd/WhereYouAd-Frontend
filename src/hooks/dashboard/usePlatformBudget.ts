import type { TProviderType } from "@/types/dashboard/overview";

import { useCoreQuery } from "@/hooks/customQuery";

import { getBudget } from "@/api/dashboard/overview";
import useWorkspaceStore from "@/store/useWorkspaceStore";

const WARNING_THRESHOLD = 50;
const DANGER_THRESHOLD = 75;

// 단일 플랫폼 예산 소진 현황
export function usePlatformBudget(provider: TProviderType) {
  const orgId = useWorkspaceStore((s) => s.selectedOrgId);

  return useCoreQuery(
    ["platform", "budget", orgId, provider],
    () => getBudget(orgId!, provider),
    {
      enabled: !!orgId && !!provider,
      select: (data) => ({
        totalBudget: data.totalBudget,
        spent: data.totalSpend,
        warningThreshold: WARNING_THRESHOLD,
        dangerThreshold: DANGER_THRESHOLD,
      }),
    },
  );
}
