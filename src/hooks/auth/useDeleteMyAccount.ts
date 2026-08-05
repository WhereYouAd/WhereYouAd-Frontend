import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { IApiErrorResponse } from "@/types/common/common";

import { useCoreMutation } from "@/hooks/customQuery";

import { deleteMyAccount } from "@/api/auth/auth";
import useAuthStore from "@/store/useAuthStore";

const WITHDRAW_ERROR_MESSAGES: Record<string, string> = {
  USER_400_9: "조직 소유권 양도를 진행한 후 탈퇴를 시도해주세요",
  USER_409_1:
    "소셜 정보가 없습니다. 소셜 계정으로 다시 로그인한 뒤 시도해주세요",
  USER_502_1: "소셜 연동 해제에 실패했습니다. 잠시 후 다시 시도해주세요",
  USER_404_1: "사용자 정보를 찾을 수 없습니다",
};

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
        WITHDRAW_ERROR_MESSAGES[apiError.code] ??
        apiError.message ??
        "회원 탈퇴에 실패했습니다. 다시 시도해주세요";
      toast.error(message);
    },
  });
}
