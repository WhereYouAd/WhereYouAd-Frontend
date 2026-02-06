import { type TSocialLoginPlatform } from "@/types/auth/auth";

export const useSocialLogin = () => {
  const handleSocialLogin = (platform: TSocialLoginPlatform) => {
    const API_BASE_URL =
      import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_TARGET_URL;

    const baseUrl = `${API_BASE_URL}/oauth2/authorization/${platform}`;
    window.location.href = `${baseUrl}`;
  };

  return { handleSocialLogin };
};
