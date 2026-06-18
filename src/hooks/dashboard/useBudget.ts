import type { TProviderType } from "@/types/dashboard/overview";

import { useCoreQuery } from "@/hooks/customQuery";

import { getBudget } from "@/api/dashboard/overview";
import { QUERY_KEYS } from "@/lib/queryKeys";
import useWorkspaceStore from "@/store/useWorkspaceStore";

const WARNING_THRESHOLD = 50;
const DANGER_THRESHOLD = 75;

export function useBudget(provider?: TProviderType) {
  const orgId = useWorkspaceStore((s) => s.selectedOrgId);

  const queryKey = provider
    ? QUERY_KEYS.platform.budget(orgId, provider)
    : QUERY_KEYS.overview.budget(orgId);

  return useCoreQuery(queryKey, () => getBudget(orgId!, provider), {
    enabled: !!orgId && (provider ? !!provider : true),
    select: (data) => ({
      totalBudget: data.totalBudget,
      spent: data.totalSpend,
      warningThreshold: WARNING_THRESHOLD,
      dangerThreshold: DANGER_THRESHOLD,
    }),
  });
}
