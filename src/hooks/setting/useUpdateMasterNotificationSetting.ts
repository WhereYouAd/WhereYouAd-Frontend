import type { IUpdateMasterNotificationSettingRequest } from "@/types/setting/notification";

import { useCoreMutation } from "../customQuery";

import { updateMasterNotificationSetting } from "@/api/notification/notification";
import { QUERY_KEYS } from "@/lib/queryKeys";
import useWorkspaceStore from "@/store/useWorkspaceStore";

export function useUpdateMasterNotificationSettings() {
  const orgId = useWorkspaceStore((s) => s.selectedOrgId);

  return useCoreMutation(
    (body: IUpdateMasterNotificationSettingRequest) => {
      if (orgId == null) {
        return Promise.reject(new Error("워크스페이스를 선택해주세요"));
      }
      return updateMasterNotificationSetting(orgId, body);
    },
    {
      invalidateKeys:
        orgId != null ? [QUERY_KEYS.notification.settings(orgId)] : [],
    },
  );
}
