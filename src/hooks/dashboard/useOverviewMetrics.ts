import { metricsToKpis } from "@/utils/dashboard/metricsToKpis";

import { useCoreQuery } from "@/hooks/customQuery";

import { getOverview } from "@/api/dashboard/overview";
import useWorkspaceStore from "@/store/useWorkspaceStore";

export function useOverviewMetrics() {
  const orgId = useWorkspaceStore((s) => s.selectedOrgId);

  return useCoreQuery(
    ["overview", "metrics", orgId],
    () => getOverview(orgId!),
    {
      enabled: !!orgId,
      select: metricsToKpis,
    },
  );
}
