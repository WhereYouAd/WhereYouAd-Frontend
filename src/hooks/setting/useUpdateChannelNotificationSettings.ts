import type { IUpdateChannelNotificationSettingsRequest } from "@/types/setting/notification";

import { useCoreMutation } from "../customQuery";

import { updateChannelNotificationSettings } from "@/api/notification/notification";
import { QUERY_KEYS } from "@/lib/queryKeys";
import useWorkspaceStore from "@/store/useWorkspaceStore";

export function useUpdateChannelNotificationSettings() {
  const orgId = useWorkspaceStore((s) => s.selectedOrgId);

  return useCoreMutation(
    (body: IUpdateChannelNotificationSettingsRequest) => {
      if (orgId == null) {
        return Promise.reject(new Error("워크스페이스를 선택해주세요"));
      }
      return updateChannelNotificationSettings(orgId, body);
    },
    {
      invalidateKeys:
        orgId != null ? [QUERY_KEYS.notification.settings(orgId)] : [],
    },
  );
}
