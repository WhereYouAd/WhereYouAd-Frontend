import type { INotificationMembersData } from "@/types/setting/notification";

import { useCoreInfiniteQuery } from "@/hooks/customQuery";

import { getNotificationMembers } from "@/api/notification/notification";
import { QUERY_KEYS } from "@/lib/queryKeys";

export function useNotificationMembers(orgId: number) {
  return useCoreInfiniteQuery<INotificationMembersData>(
    QUERY_KEYS.notification.members(orgId),
    ({ pageParam }) =>
      getNotificationMembers(orgId, {
        cursor: pageParam ?? undefined,
      }),
    {
      initialPageParam: null,
      getNextPageParam: (lastPage) =>
        lastPage.hasNext ? lastPage.nextCursor : undefined,
      enabled: Number.isFinite(orgId) && orgId > 0,
    },
  );
}
