import type { ICommonResponse } from "@/types/common/common";

import { axiosInstance } from "@/lib/axiosInstance";

interface IGoogleLoginResponse {
  redirectUrl: string;
}

/**
 * Google Ads OAuth 시작.
 *
 * Accept: application/json → 302 Location을 JSON redirectUrl로 받은 뒤
 * window.location으로 이동 (XHR이 Google에 직접 가지 않음).
 *
 * 로컬: vite dev middleware가 302 → JSON 변환
 * 운영: 백엔드가 동일 JSON 응답 필요
 */
export async function startGoogleOAuthLogin(orgId: number): Promise<void> {
  const { data } = await axiosInstance.get<
    ICommonResponse<IGoogleLoginResponse>
  >("/api/google/login", {
    params: { orgId },
    headers: { Accept: "application/json" },
  });

  const redirectUrl = data.data?.redirectUrl;
  if (!redirectUrl) {
    throw new Error("Google 연동 URL을 받지 못했습니다.");
  }

  window.location.assign(redirectUrl);
}
