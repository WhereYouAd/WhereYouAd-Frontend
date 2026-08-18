import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { IApiErrorResponse } from "@/types/common/common";

import { useCoreMutation } from "@/hooks/customQuery";

import { postLogout } from "@/api/auth/auth";
import useAuthStore from "@/store/useAuthStore";
import useWorkspaceStore from "@/store/useWorkspaceStore";

export function useLogout() {
  const logout = useAuthStore((s) => s.logout);
  const queryClient = useQueryClient();

  return useCoreMutation(postLogout, {
    userOnSuccess: () => {
      toast.success("로그아웃이 완료되었습니다");
      queryClient.clear();
      useWorkspaceStore.getState().reset();
      logout();
      window.location.replace("/");
    },
    userOnError: (error) => {
      const apiError = error as IApiErrorResponse;
      const message =
        apiError.message ?? "로그아웃에 실패했습니다. 다시 시도해주세요";
      toast.error(message);
    },
  });
}
