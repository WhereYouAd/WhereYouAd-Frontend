import { toast } from "sonner";

import type { IApiErrorResponse } from "@/types/common/common";

import { useCoreMutation } from "@/hooks/customQuery";

import {
  readAllNotificationHistory,
  readNotificationHistory,
} from "@/api/notification/notification";
import { QUERY_KEYS } from "@/lib/queryKeys";
import useWorkspaceStore from "@/store/useWorkspaceStore";

export function useReadNotification() {
  const orgId = useWorkspaceStore((s) => s.selectedOrgId);

  return useCoreMutation(
    (useNotificationId: number) => {
      if (orgId == null) {
        return Promise.reject(new Error("워크스페이스를 선택해주세요"));
      }
      return readNotificationHistory(orgId, useNotificationId);
    },
    {
      invalidateKeys:
        orgId != null ? [QUERY_KEYS.notification.history(orgId)] : [],
      userOnError: (error) => {
        toast.error(
          (error as IApiErrorResponse).message ??
            "알림을 읽음 처리하지 못헀습니다",
        );
      },
    },
  );
}

export function useAllReadNotifications() {
  const orgId = useWorkspaceStore((s) => s.selectedOrgId);

  return useCoreMutation(
    () => {
      if (orgId == null) {
        return Promise.reject(new Error("워크스페이스를 선택해주세요"));
      }
      return readAllNotificationHistory(orgId);
    },
    {
      invalidateKeys:
        orgId != null ? [QUERY_KEYS.notification.history(orgId)] : [],
      userOnError: (error) => {
        toast.error(
          (error as IApiErrorResponse).message ??
            "알림을 모두 읽음 처리하지 못헀습니다",
        );
      },
    },
  );
}
