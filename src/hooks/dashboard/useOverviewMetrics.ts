import { metricsToKpis } from "@/utils/dashboard/metricsToKpis";

import { useCoreQuery } from "@/hooks/customQuery";

import { getOverview } from "@/api/dashboard/overview";
import { QUERY_KEYS } from "@/lib/queryKeys";
import useWorkspaceStore from "@/store/useWorkspaceStore";

export function useOverviewMetrics() {
  const orgId = useWorkspaceStore((s) => s.selectedOrgId);

  return useCoreQuery(
    QUERY_KEYS.overview.metrics(orgId),
    () => getOverview(orgId!),
    {
      enabled: !!orgId,
      select: metricsToKpis,
    },
  );
}
