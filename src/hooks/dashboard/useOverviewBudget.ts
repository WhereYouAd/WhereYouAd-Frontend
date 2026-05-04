import { useCoreQuery } from "@/hooks/customQuery";

import { getBudget } from "@/api/dashboard/overview";
import useWorkspaceStore from "@/store/useWorkspaceStore";

// 예산 소진율 임계값
const WARNING_THRESHOLD = 50;
const DANGER_THRESHOLD = 75;

// 예산 소진 현황 조회
export function useOverviewBudget() {
  // TODO: 테스트용 - 예산 데이터가 orgId 2에만 있어서 임시 고정, 테스트 후 원래대로 복구할 예정
  // const orgId = useWorkspaceStore((s) => s.selectedOrgId);
  useWorkspaceStore((s) => s.selectedOrgId);
  const orgId = 2;

  return useCoreQuery(["overview", "budget", orgId], () => getBudget(orgId), {
    enabled: !!orgId,
    select: (data) => ({
      totalBudget: data.totalBudget,
      spent: data.totalSpend,
      warningThreshold: WARNING_THRESHOLD,
      dangerThreshold: DANGER_THRESHOLD,
    }),
  });
}
