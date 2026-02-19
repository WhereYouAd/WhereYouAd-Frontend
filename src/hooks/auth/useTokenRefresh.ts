import { useEffect, useRef } from "react";

import { reissueToken } from "@/api/auth/auth";
import useAuthStore from "@/store/useAuthStore";

export const useTokenRefresh = () => {
  const { setAccessToken, logout } = useAuthStore();
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    if (!localStorage.getItem("hasSession")) return;

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
