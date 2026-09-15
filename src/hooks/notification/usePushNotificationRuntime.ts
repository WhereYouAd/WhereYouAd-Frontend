import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

import type { TNotificationType } from "@/types/notification/notification";
import type { IPushReceivedMessage } from "@/types/notification/push";

import {
  prependNotification,
  type TNotificationHistoryCache,
} from "@/utils/notification/historyCache";
import {
  registerPushServiceWorker,
  syncPushSubscription,
} from "@/utils/notification/webPush";

import { useMyNotificationSettings } from "@/hooks/setting/useMyNotificationSettings";

import { QUERY_KEYS } from "@/lib/queryKeys";
import useWorkspaceStore from "@/store/useWorkspaceStore";

const NOTIFICATION_TYPES: TNotificationType[] = [
  "BOT_CLICKS",
  "CLICKS_INCREASE",
  "REPORT",
];

function toNotificationType(value: unknown): TNotificationType {
  if (
    typeof value === "string" &&
    NOTIFICATION_TYPES.includes(value as TNotificationType)
  ) {
    return value as TNotificationType;
  }
  return "REPORT";
}

export function usePushNotificationRuntime() {
  const orgId = useWorkspaceStore((s) => s.selectedOrgId);
  const { data: settings } = useMyNotificationSettings();
  const queryClient = useQueryClient();

  useEffect(() => {
    void registerPushServiceWorker();
  }, []);

  useEffect(() => {
    // 이 브라우저 객체에 serviceWorker라는 기능이 없으면 그만둠 / 있으면 이 브라우저는 SW 지원
    if (!("serviceWorker" in navigator)) return;

    const onMessage = (event: MessageEvent<IPushReceivedMessage>) => {
      if (event.data?.type !== "PUSH_RECEIVED") return;
      if (orgId == null) return;

      const payload = event.data.payload;
      if (payload?.orgId != null && payload.orgId !== orgId) return;

      const historyKey = QUERY_KEYS.notification.history(orgId);
      queryClient.setQueryData<TNotificationHistoryCache>(historyKey, (old) =>
        prependNotification(old, {
          userNotificationId: payload?.userNotificationId ?? -Date.now(),
          title: payload?.title ?? "알림",
          message: payload?.message ?? payload?.body ?? "",
          createdAt: new Date().toISOString(),
          type: toNotificationType(payload?.type),
          isRead: false,
        }),
      );
      void queryClient.invalidateQueries({
        queryKey: historyKey,
      });
    };

    navigator.serviceWorker.addEventListener("message", onMessage);

    return () => {
      navigator.serviceWorker.removeEventListener("message", onMessage);
    };
  }, [orgId, queryClient]);

  useEffect(() => {
    if (orgId == null) return;
    if (!settings?.isMasterEnabled || !settings.isBrowserPushEnabled) return;
    void syncPushSubscription(orgId);
  }, [orgId, settings?.isMasterEnabled, settings?.isBrowserPushEnabled]);
}
