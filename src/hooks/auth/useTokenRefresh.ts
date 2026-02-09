import { useEffect } from "react";

import { reissueToken } from "@/api/auth/auth";
import useAuthStore from "@/store/useAuthStore";

export const useTokenRefresh = () => {
  const { setAccessToken, login, logout } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data } = await reissueToken();
        if (data.accessToken) {
          // TODO: 재발급 성공 시 로그인 처리
          login("user@example.com", data.accessToken);
        }
      } catch (error) {
        console.log("토큰 재발급 실패:", error);
        logout();
      }
    };

    initAuth();
  }, [login, logout, setAccessToken]);
};
