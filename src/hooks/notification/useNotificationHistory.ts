import { useInfiniteQuery } from "@tanstack/react-query";

import type { IApiErrorResponse } from "@/types/common/common";
import type { INotificationHistoryData } from "@/types/notification/notification";
import { MOCK_NOTIFICATION_HISTORY } from "@/types/notification/notification.mock";

import { getNotificationHistory } from "@/api/notification/notification";
import { QUERY_KEYS } from "@/lib/queryKeys";
import useWorkspaceStore from "@/store/useWorkspaceStore";

// 확인 끝나면 false로 되돌리고 mock 파일 삭제
const USE_MOCK_NOTIFICATION_HISTORY = true;

export function useNotificationHistory() {
  const orgId = useWorkspaceStore((s) => s.selectedOrgId);

  const query = useInfiniteQuery<INotificationHistoryData, IApiErrorResponse>({
    queryKey: [
      ...QUERY_KEYS.notification.history(orgId),
      USE_MOCK_NOTIFICATION_HISTORY ? "mock" : "api",
    ],
    queryFn: ({ pageParam }) => {
      if (USE_MOCK_NOTIFICATION_HISTORY) {
        return Promise.resolve(MOCK_NOTIFICATION_HISTORY);
      }
      return getNotificationHistory(orgId as number, {
        cursor: (pageParam as string | null) ?? undefined,
      });
    },
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
