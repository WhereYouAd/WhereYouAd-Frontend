import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { IApiErrorResponse } from "@/types/common/common";
import type { IUpdateTimelineVariables } from "@/types/timeline/api";

import { useCoreMutation } from "../customQuery";

import { updateTimeline } from "@/api/timeline/timeline";
import { QUERY_KEYS } from "@/lib/queryKeys";
import useWorkspaceStore from "@/store/useWorkspaceStore";

export function useUpdateTimeline() {
  const orgId = useWorkspaceStore((s) => s.selectedOrgId);
  const queryClient = useQueryClient();
  return useCoreMutation(
    ({ timelineId, body }: IUpdateTimelineVariables) => {
      if (orgId == null) {
        return Promise.reject(new Error("수정할 워크스페이스를 선택해주세요"));
      }
      return updateTimeline(orgId, timelineId, body);
    },
    {
      invalidateKeys: orgId != null ? [QUERY_KEYS.timeline.list(orgId)] : [],
      userOnSuccess: (data, { timelineId }) => {
        if (orgId != null) {
          void queryClient.invalidateQueries({
            queryKey: QUERY_KEYS.timeline.detail(orgId, timelineId),
          });
        }
        toast.success("타임라인이 수정되었습니다", {
          description: `"${data.name}" 타임라인의 변경내용을 저장했습니다`,
        });
      },
      userOnError: (error) => {
        const message =
          (error as IApiErrorResponse).message ??
          "타임라인 수정에 실패했습니다. 다시 시도해주세요";
        toast.error(message);
      },
    },
  );
}
