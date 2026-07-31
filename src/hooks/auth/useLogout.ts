import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import type { IApiErrorResponse } from "@/types/common/common";

import { useCoreMutation } from "@/hooks/customQuery";

import { postLogout } from "@/api/auth/auth";
import useAuthStore from "@/store/useAuthStore";

export function useLogout() {
  const nav = useNavigate();
  const logout = useAuthStore((s) => s.logout);

  return useCoreMutation(postLogout, {
    userOnSuccess: () => {
      logout();
      nav("/", { replace: true });
    },
    userOnError: (error) => {
      const message =
        (error as IApiErrorResponse).message ??
        "로그아웃에 실패했습니다. 다시 시도해주세요";
      toast.error(message);
    },
  });
}
