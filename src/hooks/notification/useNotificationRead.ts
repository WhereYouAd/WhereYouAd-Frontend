import { toast } from "sonner";

import type { IApiErrorResponse } from "@/types/common/common";
import type { TNotificationEmptyData } from "@/types/setting/notification";

import {
  markAllNotificationRead,
  markNotificationRead,
  type TNotificationHistoryCache,
} from "@/utils/notification/historyCache";

import { useCoreMutation } from "@/hooks/customQuery";

import {
  readAllNotificationHistory,
  readNotificationHistory,
} from "@/api/notification/notification";
import { QUERY_KEYS } from "@/lib/queryKeys";
import useWorkspaceStore from "@/store/useWorkspaceStore";

export function useReadNotification() {
  const orgId = useWorkspaceStore((s) => s.selectedOrgId);

  return useCoreMutation<
    TNotificationEmptyData,
    number,
    IApiErrorResponse,
    { prevData?: unknown },
    TNotificationHistoryCache
  >(
    (useNotificationId: number) => {
      if (orgId == null) {
        return Promise.reject(new Error("워크스페이스를 선택해주세요"));
      }
      return readNotificationHistory(orgId, useNotificationId);
    },
    {
      // 작동예시
      // mutate(5) 호출
      // 아직 서버 응답 전 updateFn이 캐시 id 5번을 isRead: true로 변경 -> 바로 뱃지 -1
      // 동시에 PATCH 요청
      // 실패하면 4번칸의 prevData로 캐시 복구 -> 뱃지 +1 (즉,원상복구)
      // 성공하면 history 다시 GET해서 서버랑 맞춤
      optimisticUpdate:
        orgId != null
          ? {
              key: QUERY_KEYS.notification.history(orgId),
              updateFn: (old, userNotificationId) =>
                markNotificationRead(old, userNotificationId),
            }
          : undefined,
      invalidateKeys:
        orgId != null ? [QUERY_KEYS.notification.history(orgId)] : [],
      userOnError: (error) => {
        toast.error(
          (error as IApiErrorResponse).message ??
            "알림을 읽음 처리하지 못했습니다",
        );
      },
    },
  );
}

export function useAllReadNotifications() {
  const orgId = useWorkspaceStore((s) => s.selectedOrgId);

  return useCoreMutation<
    TNotificationEmptyData,
    void,
    IApiErrorResponse,
    { prevData?: unknown },
    TNotificationHistoryCache
  >(
    () => {
      if (orgId == null) {
        return Promise.reject(new Error("워크스페이스를 선택해주세요"));
      }
      return readAllNotificationHistory(orgId);
    },
    {
      optimisticUpdate:
        orgId != null
          ? {
              key: QUERY_KEYS.notification.history(orgId),
              updateFn: (old) => markAllNotificationRead(old),
            }
          : undefined,
      invalidateKeys:
        orgId != null ? [QUERY_KEYS.notification.history(orgId)] : [],
      userOnError: (error) => {
        toast.error(
          (error as IApiErrorResponse).message ??
            "알림을 모두 읽음 처리하지 못했습니다",
        );
      },
    },
  );
}
