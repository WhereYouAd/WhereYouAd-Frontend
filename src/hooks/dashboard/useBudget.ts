import type { IBudgetQueryData } from "@/types/dashboard/budget";
import type { IBudgetResponse } from "@/types/dashboard/common";
import type { TProviderType } from "@/types/dashboard/overview";

import { toBudgetQueryData } from "@/utils/dashboard/budget";

import { useCoreQuery } from "@/hooks/customQuery";

import { getBudget } from "@/api/dashboard/overview";
import { QUERY_KEYS } from "@/lib/queryKeys";
import useWorkspaceStore from "@/store/useWorkspaceStore";

export function useBudget(provider?: TProviderType) {
  const orgId = useWorkspaceStore((s) => s.selectedOrgId);

  const queryKey = provider
    ? QUERY_KEYS.platform.budget(orgId, provider)
    : QUERY_KEYS.overview.budget(orgId);

  return useCoreQuery<IBudgetResponse, IBudgetQueryData>(
    queryKey,
    () => getBudget(orgId!, provider),
    {
      enabled: !!orgId,
      select: (data) => toBudgetQueryData(data, provider),
    },
  );
}
