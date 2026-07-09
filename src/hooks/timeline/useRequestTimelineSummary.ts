import { toast } from "sonner";

import type { IApiErrorResponse } from "@/types/common/common";

import { useCoreMutation } from "../customQuery";

import { requestTimelineSummary } from "@/api/timeline/timeline";
import useWorkspaceStore from "@/store/useWorkspaceStore";

export function useRequestTimelineSummary() {
  const orgId = useWorkspaceStore((s) => s.selectedOrgId);

  return useCoreMutation(
    (timelineId: number) => {
      if (orgId == null) {
        return Promise.reject(new Error("성과 요약할 타임라인을 선택해주세요"));
      }
      return requestTimelineSummary(orgId, timelineId);
    },
    {
      userOnSuccess: () => {
        toast.success("AI 요약을 생성하고 있어요", {
          description: "더 자세한 분석을 위해 AI가 요약중입니다",
        });
      },
      userOnError: (error) => {
        const message =
          (error as IApiErrorResponse).message ??
          "AI 요약 요청에 실패했습니다. 창을 닫고 다시 시도해주세요";
        toast.error(message);
      },
    },
  );
}
