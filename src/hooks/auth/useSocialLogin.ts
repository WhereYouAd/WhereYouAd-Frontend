import { type TSocialLoginPlatform } from "@/types/auth/auth";

export const useSocialLogin = () => {
  const handleSocialLogin = (platform: TSocialLoginPlatform) => {
    const API_TARGET_URL =
      import.meta.env.VITE_API_TARGET_URL || import.meta.env.VITE_API_BASE_URL;

    window.location.href = `${API_TARGET_URL}/oauth2/authorization/${platform}`;
  };

  return { handleSocialLogin };
};
