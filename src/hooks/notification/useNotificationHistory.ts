import type { INotificationHistoryData } from "@/types/notification/notification";

import { useCoreInfiniteQuery } from "@/hooks/customQuery";

import { getNotificationHistory } from "@/api/notification/notification";
import { QUERY_KEYS } from "@/lib/queryKeys";
import useWorkspaceStore from "@/store/useWorkspaceStore";

export function useNotificationHistory() {
  const orgId = useWorkspaceStore((s) => s.selectedOrgId);

  const query = useCoreInfiniteQuery<INotificationHistoryData>(
    QUERY_KEYS.notification.history(orgId),

    ({ pageParam }) =>
      getNotificationHistory(orgId as number, {
        cursor: pageParam ?? undefined,
      }),

    {
      initialPageParam: null,
      getNextPageParam: (lastPage) =>
        lastPage.hasNext ? lastPage.nextCursor : undefined,
      enabled: orgId != null,
    },
  );

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
