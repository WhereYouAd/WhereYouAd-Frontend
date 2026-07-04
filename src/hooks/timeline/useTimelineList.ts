import { useCoreQuery } from "@/hooks/customQuery";

import { getTimelineList } from "@/api/timeline/timeline";
import { QUERY_KEYS } from "@/lib/queryKeys";
import useWorkspaceStore from "@/store/useWorkspaceStore";

export function useTimelineList() {
  const orgId = useWorkspaceStore((s) => s.selectedOrgId);
  return useCoreQuery(
    QUERY_KEYS.timeline.list(orgId),
    () => getTimelineList(orgId!),
    {
      enabled: orgId != null,
    },
  );
}
