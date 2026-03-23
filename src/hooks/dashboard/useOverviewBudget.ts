import { useCoreQuery } from "@/hooks/customQuery";

import { getBudget } from "@/api/dashboard/overview";
import useWorkspaceStore from "@/store/useWorkspaceStore";

const WARNING_THRESHOLD = 50;
const DANGER_THRESHOLD = 75;

export function useOverviewBudget() {
  const orgId = useWorkspaceStore((s) => s.selectedOrgId);

  return useCoreQuery(["overview", "budget", orgId], () => getBudget(orgId!), {
    enabled: !!orgId,
    select: (data) => ({
      totalBudget: data.totalBudget,
      spent: data.totalSpend,
      warningThreshold: WARNING_THRESHOLD,
      dangerThreshold: DANGER_THRESHOLD,
    }),
  });
}
