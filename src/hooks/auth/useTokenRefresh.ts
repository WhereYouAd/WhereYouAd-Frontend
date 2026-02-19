import { useEffect } from "react";

import { reissueToken } from "@/api/auth/auth";
import useAuthStore from "@/store/useAuthStore";

export const useTokenRefresh = () => {
  const { setAccessToken, logout } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data } = await reissueToken();
        if (data.accessToken) {
          setAccessToken(data.accessToken);
        }
      } catch {
        logout();
      }
    };

    initAuth();
  }, [setAccessToken, logout]);
};
