import { useSearchParams } from "react-router-dom";

import { type TSocialLoginPlatform } from "@/types/auth/auth";

import { AUTH_RETURN_URL_KEY, getSafeReturnUrl } from "@/utils/auth/returnUrl";

export const useSocialLogin = () => {
  const [searchParams] = useSearchParams();
  const handleSocialLogin = (platform: TSocialLoginPlatform) => {
    const API_TARGET_URL =
      import.meta.env.VITE_API_TARGET_URL || import.meta.env.VITE_API_BASE_URL;

    const safeReturnUrl = getSafeReturnUrl(searchParams.get("returnUrl"), "");
    if (safeReturnUrl) {
      sessionStorage.setItem(AUTH_RETURN_URL_KEY, safeReturnUrl);
    } else {
      sessionStorage.removeItem(AUTH_RETURN_URL_KEY);
    }

    window.location.href = `${API_TARGET_URL}/oauth2/authorization/${platform}`;
  };

  return { handleSocialLogin };
};
