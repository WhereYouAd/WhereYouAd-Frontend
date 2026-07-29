import type { IUpdateAlertsNotificationSettingsRequest } from "@/types/setting/notification";

import { useCoreMutation } from "../customQuery";

import { updateAlertsNotificationSettings } from "@/api/notification/notification";
import { QUERY_KEYS } from "@/lib/queryKeys";
import useWorkspaceStore from "@/store/useWorkspaceStore";

export function useUpdateAlertsNotificationSettings() {
  const orgId = useWorkspaceStore((s) => s.selectedOrgId);
  return useCoreMutation(
    (body: IUpdateAlertsNotificationSettingsRequest) => {
      if (orgId == null) {
        return Promise.reject(new Error("워크스페이스를 선택해주세요"));
      }
      return updateAlertsNotificationSettings(orgId, body);
    },
    {
      invalidateKeys:
        orgId != null ? [QUERY_KEYS.notification.settings(orgId)] : [],
    },
  );
}
