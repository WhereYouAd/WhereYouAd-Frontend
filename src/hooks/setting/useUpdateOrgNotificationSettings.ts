import type { IUpdateOrgNotificationSettingsRequest } from "@/types/setting/notification";

import { useCoreMutation } from "../customQuery";

import { updateOrgNotificationSettings } from "@/api/notification/notification";
import { QUERY_KEYS } from "@/lib/queryKeys";
import useWorkspaceStore from "@/store/useWorkspaceStore";

export function useUpdateOrgNotificationSettings() {
  const orgId = useWorkspaceStore((s) => s.selectedOrgId);

  return useCoreMutation(
    (body: IUpdateOrgNotificationSettingsRequest) => {
      if (orgId == null) {
        return Promise.reject(new Error("워크스페이스를 선택해주세요"));
      }
      return updateOrgNotificationSettings(orgId, body);
    },
    {
      invalidateKeys:
        orgId != null ? [QUERY_KEYS.notification.settings(orgId)] : [],
    },
  );
}
