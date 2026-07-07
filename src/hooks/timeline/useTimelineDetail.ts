import type { TUseQueryCustomOptions } from "@/types/common/common";
import type { ITimelineDetail } from "@/types/timeline/api";

import { useCoreQuery } from "@/hooks/customQuery";

import { getTimelineDetail } from "@/api/timeline/timeline";
import { QUERY_KEYS } from "@/lib/queryKeys";
import useWorkspaceStore from "@/store/useWorkspaceStore";

export function useTimelineDetail(
  timelineId: number | null,
  options?: TUseQueryCustomOptions<ITimelineDetail>,
) {
  const orgId = useWorkspaceStore((s) => s.selectedOrgId);

  return useCoreQuery(
    QUERY_KEYS.timeline.detail(orgId, timelineId),
    () => getTimelineDetail(orgId!, timelineId!),
    { enabled: orgId != null && timelineId != null, ...options },
  );
}
