import { useCoreQuery } from "@/hooks/customQuery";

import { getBudget } from "@/api/dashboard/overview";
import useWorkspaceStore from "@/store/useWorkspaceStore";

// 예산 소진율 임계값
const WARNING_THRESHOLD = 50;
const DANGER_THRESHOLD = 75;

// 예산 소진 현황 조회
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
