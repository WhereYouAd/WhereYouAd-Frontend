import type { INotificationHistoryData } from "@/types/notification/notification";
import { MOCK_NOTIFICATION_HISTORY } from "@/types/notification/notification.mock";

import { useCoreInfiniteQuery } from "@/hooks/customQuery";

import { getNotificationHistory } from "@/api/notification/notification";
import { QUERY_KEYS } from "@/lib/queryKeys";
import useWorkspaceStore from "@/store/useWorkspaceStore";

// 확인 끝나면 false로 되돌리고 mock 파일 삭제
const USE_MOCK_NOTIFICATION_HISTORY = true;

export function useNotificationHistory() {
  const orgId = useWorkspaceStore((s) => s.selectedOrgId);

  const query = useCoreInfiniteQuery<INotificationHistoryData>(
    [
      ...QUERY_KEYS.notification.history(orgId),
      USE_MOCK_NOTIFICATION_HISTORY ? "mock" : "api",
    ],
    ({ pageParam }) => {
      if (USE_MOCK_NOTIFICATION_HISTORY) {
        return Promise.resolve(MOCK_NOTIFICATION_HISTORY);
      }
      return getNotificationHistory(orgId as number, {
        cursor: pageParam ?? undefined,
      });
    },
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
