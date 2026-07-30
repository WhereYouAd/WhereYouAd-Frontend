import { useInfiniteQuery } from "@tanstack/react-query";

import type { IApiErrorResponse } from "@/types/common/common";
import type { INotificationMembersData } from "@/types/setting/notification";

import { getNotificationMembers } from "@/api/notification/notification";
import { QUERY_KEYS } from "@/lib/queryKeys";

export function useNotificationMembers(orgId: number) {
  return useInfiniteQuery<INotificationMembersData, IApiErrorResponse>({
    queryKey: QUERY_KEYS.notification.members(orgId),
    queryFn: ({ pageParam }) =>
      getNotificationMembers(orgId, {
        cursor: (pageParam as string | null) ?? undefined,
      }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? lastPage.nextCursor : undefined,
    enabled: Number.isFinite(orgId) && orgId > 0,
  });
}
