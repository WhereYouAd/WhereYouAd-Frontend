import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import {
  AUTH_RETURN_URL_KEY,
  buildPathWithReturnUrl,
  getSafeReturnUrl,
} from "@/utils/auth/returnUrl";

import useAuthStore from "@/store/useAuthStore";

export default function RedirectPage() {
  const navigate = useNavigate();
  const { setAccessToken } = useAuthStore();
  const processed = useRef(false);

  useEffect(() => {
    if (processed.current) return;
    processed.current = true;

    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(";").shift();
    };

    const deleteCookie = (name: string) => {
      document.cookie =
        name + "=; Max-Age=0; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    };

    const storedReturnUrl = sessionStorage.getItem(AUTH_RETURN_URL_KEY);
    sessionStorage.removeItem(AUTH_RETURN_URL_KEY);

    const accessToken = getCookie("access_token");

    if (accessToken) {
      deleteCookie("access_token");
      setAccessToken(accessToken);

      toast.success("소셜 로그인되었습니다.");
      navigate(getSafeReturnUrl(storedReturnUrl), { replace: true });
    } else {
      toast.error("소셜 로그인에 실패했습니다. 다시 시도해주세요.");
      navigate(buildPathWithReturnUrl("/login", storedReturnUrl), {
        replace: true,
      });
    }
  }, [navigate, setAccessToken]);

  return (
    <div className="relative flex justify-center items-center h-screen w-full bg-surface-100">
      <div className="relative flex justify-center h-75 min-w-70 w-112.5 max-w-[96vw]">
        <div className="absolute top-80 font-body1 text-text-muted animate-pulse">
          로그인 중...
        </div>
      </div>
    </div>
  );
}
