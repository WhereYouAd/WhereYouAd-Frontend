import type { INotificationHistoryData } from "@/types/notification/notification";
import { MOCK_NOTIFICATION_HISTORY } from "@/types/notification/notification.mock";

import { useCoreQuery } from "@/hooks/customQuery";

import useWorkspaceStore from "@/store/useWorkspaceStore";

const MOCK_LOADING_MS = 400;

//API 연동전 mock데이터 활용을 위함. API함수추가시 삭제예정
async function getMockNotificationHistory(): Promise<INotificationHistoryData> {
  await new Promise((resolve) => setTimeout(resolve, MOCK_LOADING_MS));
  return MOCK_NOTIFICATION_HISTORY;
}

export function useNotificationHistory() {
  const orgId = useWorkspaceStore((s) => s.selectedOrgId);

  const query = useCoreQuery(
    ["notification-history", orgId],
    getMockNotificationHistory,
    { enabled: orgId != null },
  );

  const notifications = query.data?.notifications ?? [];
  const unreadCount = notifications.filter((item) => !item.isRead).length;

  return {
    orgId,
    notifications,
    unreadCount,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
