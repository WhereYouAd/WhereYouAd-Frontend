import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { IApiErrorResponse } from "@/types/common/common";

import { useCoreMutation } from "@/hooks/customQuery";

import { deleteMyAccount } from "@/api/auth/auth";
import useAuthStore from "@/store/useAuthStore";

export function useDeleteMyAccount() {
  const nav = useNavigate();
  const queryClient = useQueryClient();
  const logout = useAuthStore((s) => s.logout);

  return useCoreMutation(deleteMyAccount, {
    userOnSuccess: () => {
      toast.success(
        "회원 탈퇴가 완료되었습니다. 30일 후 계정이 완전히 삭제됩니다",
      );
      queryClient.clear();
      logout();
      nav("/", { replace: true });
    },
    userOnError: (error) => {
      const apiError = error as IApiErrorResponse;
      const message =
        apiError.message ?? "회원 탈퇴에 실패했습니다. 다시 시도해주세요";
      toast.error(message);
    },
  });
}
