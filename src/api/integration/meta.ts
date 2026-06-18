import type { ICommonResponse } from "@/types/common/common";

import { axiosInstance } from "@/lib/axiosInstance";

interface IMetaAuthUrlResponse {
  authUrl: string;
}

/**
 * Meta Ads OAuth 시작.
 *
 * Accept: application/json → authUrl(JSON) 또는 302 Location을 받은 뒤
 * window.location으로 이동 (XHR이 Meta에 직접 가지 않음).
 *
 * 로컬: vite dev middleware가 302 → JSON 변환
 * 운영: 백엔드가 동일 JSON 응답 필요
 */
export async function startMetaOAuthLogin(orgId: number): Promise<void> {
  const { data } = await axiosInstance.get<
    ICommonResponse<IMetaAuthUrlResponse>
  >("/api/meta/auth-url", {
    params: { orgId },
    headers: { Accept: "application/json" },
  });

  const authUrl = data.data?.authUrl;
  if (!authUrl) {
    throw new Error("Meta 연동 URL을 받지 못했습니다.");
  }

  window.location.assign(authUrl);
}
