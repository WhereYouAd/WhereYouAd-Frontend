import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { postLogout } from "@/api/auth/auth";
import useAuthStore from "@/store/useAuthStore";

export const useLogout = () => {
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const logout = useAuthStore((state) => state.logout);
  const handleLogout = async () => {
    try {
      await postLogout();
      queryClient.clear();
      logout();
      navigate("/");
    } catch (e) {
      toast.error("로그아웃에 실패하였습니다. 다시 시도해주세요");
      console.error(e);
      throw e;
    }
  };
  return {
    handleLogout,
  };
};
