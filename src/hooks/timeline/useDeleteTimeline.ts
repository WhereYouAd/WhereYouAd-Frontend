import { toast } from "sonner";

import type { IApiErrorResponse } from "@/types/common/common";

import { useCoreMutation } from "../customQuery";

import { deleteTimeline } from "@/api/timeline/timeline";
import { QUERY_KEYS } from "@/lib/queryKeys";
import useWorkspaceStore from "@/store/useWorkspaceStore";

export function useDeleteTimeline() {
  const orgId = useWorkspaceStore((s) => s.selectedOrgId);

  return useCoreMutation(
    (timelineId: number) => {
      if (orgId == null) {
        return Promise.reject(new Error("삭제할 워크스페이스를 선택해주세요"));
      }
      return deleteTimeline(orgId, timelineId);
    },
    {
      invalidateKeys: orgId != null ? [QUERY_KEYS.timeline.list(orgId)] : [],
      userOnSuccess: () => {
        toast.success("타임라인이 삭제되었습니다.");
      },
      userOnError: (error) => {
        const message =
          (error as IApiErrorResponse).message ??
          "타임라인 삭제에 실패했습니다. 다시 시도해주세요";
        toast.error(message);
      },
    },
  );
}
