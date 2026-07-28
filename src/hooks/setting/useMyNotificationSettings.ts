import { useCoreQuery } from "../customQuery";

import { getMyNotificationSettings } from "@/api/notification/notification";
import { QUERY_KEYS } from "@/lib/queryKeys";
import useWorkspaceStore from "@/store/useWorkspaceStore";

export function useMyNotificationSettings() {
  const orgId = useWorkspaceStore((s) => s.selectedOrgId);

  return useCoreQuery(
    QUERY_KEYS.notification.settings(orgId),
    () => getMyNotificationSettings(orgId!),
    {
      enabled: orgId != null,
    },
  );
}
