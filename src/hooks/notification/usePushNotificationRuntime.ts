import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

import {
  registerPushServiceWorker,
  syncPushSubscription,
} from "@/utils/notification/webPush";

import { useMyNotificationSettings } from "@/hooks/setting/useMyNotificationSettings";

import useWorkspaceStore from "@/store/useWorkspaceStore";

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

    const onMessage = (event: MessageEvent) => {
      if (event.data?.type !== "PUSH_RECEIVED") return;
      void queryClient.invalidateQueries({
        queryKey: ["notification", "history"],
      });
    };

    navigator.serviceWorker.addEventListener("message", onMessage);

    return () => {
      navigator.serviceWorker.removeEventListener("message", onMessage);
    };
  }, [queryClient]);

  useEffect(() => {
    if (orgId == null) return;
    if (!settings?.isMasterEnabled || !settings.isBrowserPushEnabled) return;
    void syncPushSubscription(orgId);
  }, [orgId, settings?.isMasterEnabled, settings?.isBrowserPushEnabled]);
}
