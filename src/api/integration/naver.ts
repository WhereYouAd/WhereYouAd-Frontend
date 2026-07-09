import type { ICommonResponse } from "@/types/common/common";
import type {
  INaverConnectResponseData,
  INaverCredentialsRequest,
} from "@/types/integration/naver";

import { encryptAesCbcBase64 } from "@/utils/integration/encryptAesCbcBase64";

import { axiosInstance } from "@/lib/axiosInstance";

/** 폼 입력(평문) → API body(키만 암호화) */
function toNaverEncryptedBody(
  body: INaverCredentialsRequest,
): INaverCredentialsRequest {
  return {
    customerId: body.customerId.trim(),
    apiKey: encryptAesCbcBase64(body.apiKey.trim()),
    secretKey: encryptAesCbcBase64(body.secretKey.trim()),
  };
}

export async function connectNaverAccount(
  orgId: number,
  body: INaverCredentialsRequest,
): Promise<void> {
  await axiosInstance.post<ICommonResponse<INaverConnectResponseData>>(
    `/api/platform/${orgId}/accounts/naver`,
    toNaverEncryptedBody(body),
  );
}

export async function updateNaverAccount(
  orgId: number,
  body: INaverCredentialsRequest,
): Promise<void> {
  await axiosInstance.patch(
    `/api/platform/${orgId}/accounts/naver`,
    toNaverEncryptedBody(body),
  );
}
