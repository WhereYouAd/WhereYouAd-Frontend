import { toast } from "sonner";

import type { IApiErrorResponse } from "@/types/common/common";
import type { ITimelineUpsertRequest } from "@/types/timeline/api";

import { useCoreMutation } from "@/hooks/customQuery";

import { createTimeline } from "@/api/timeline/timeline";
import { QUERY_KEYS } from "@/lib/queryKeys";
import useWorkspaceStore from "@/store/useWorkspaceStore";

export function useCreateTimeline() {
  const orgId = useWorkspaceStore((s) => s.selectedOrgId);

  return useCoreMutation(
    (body: ITimelineUpsertRequest) => {
      if (orgId == null) {
        return Promise.reject(new Error("워크스페이스를 선택해주세요"));
      }
      return createTimeline(orgId, body);
    },
    {
      invalidateKeys: orgId != null ? [QUERY_KEYS.timeline.list(orgId)] : [],
      userOnSuccess: (data) => {
        toast.success("타임라인이 생성되었습니다", {
          description: `"${data.name}" 타임라인을 추가했습니다`,
        });
      },
      userOnError: (error) => {
        const message =
          (error as IApiErrorResponse).message ??
          "타임라인 생성에 실패했습니다. 다시 시도해주세요";
        toast.error(message);
      },
    },
  );
}
