import type { ITimelineListParams } from "@/types/timeline/api";

import { useCoreQuery } from "@/hooks/customQuery";

import { getTimelineList } from "@/api/timeline/timeline";
import { QUERY_KEYS } from "@/lib/queryKeys";
import useWorkspaceStore from "@/store/useWorkspaceStore";

export function useTimelineList(params: ITimelineListParams = {}) {
  const orgId = useWorkspaceStore((s) => s.selectedOrgId);
  const sort = params.sort ?? "DISPLAY_ORDER";

  return useCoreQuery(
    QUERY_KEYS.timeline.listWithParams(orgId, {
      status: params.status ?? null,
      sort,
    }),
    () =>
      getTimelineList(orgId!, {
        status: params.status,
        sort,
      }),
    {
      enabled: orgId != null,
    },
  );
}
