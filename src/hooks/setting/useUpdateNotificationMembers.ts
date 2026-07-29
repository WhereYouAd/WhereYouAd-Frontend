import type { IUpdateNotificationMembersRequest } from "@/types/setting/notification";

import { useCoreMutation } from "../customQuery";

import { updateNotificationMembers } from "@/api/notification/notification";
import { QUERY_KEYS } from "@/lib/queryKeys";

export function useUpdateNotificationMembers(orgId: number) {
  return useCoreMutation(
    (body: IUpdateNotificationMembersRequest) =>
      updateNotificationMembers(orgId, body),
    {
      invalidateKeys: [QUERY_KEYS.notification.members(orgId)],
    },
  );
}
