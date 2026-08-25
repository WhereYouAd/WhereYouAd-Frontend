import { useInfiniteQuery } from "@tanstack/react-query";

import type { IApiErrorResponse } from "@/types/common/common";
import type { INotificationHistoryData } from "@/types/notification/notification";

import { getNotificationHistory } from "@/api/notification/notification";
import { QUERY_KEYS } from "@/lib/queryKeys";
import useWorkspaceStore from "@/store/useWorkspaceStore";

export function useNotificationHistory() {
  const orgId = useWorkspaceStore((s) => s.selectedOrgId);

  const query = useInfiniteQuery<INotificationHistoryData, IApiErrorResponse>({
    queryKey: QUERY_KEYS.notification.history(orgId),
    queryFn: ({ pageParam }) =>
      getNotificationHistory(orgId as number, {
        cursor: (pageParam as string | null) ?? undefined,
      }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? lastPage.nextCursor : undefined,
    enabled: orgId != null,
  });

  const notifications =
    query.data?.pages.flatMap((page) => page.notifications) ?? [];
  const unreadCount = notifications.filter((item) => !item.isRead).length;

  return {
    orgId,
    notifications,
    unreadCount,
    isLoading: query.isLoading,
    isError: query.isError,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    fetchNextPage: query.fetchNextPage,
  };
}
