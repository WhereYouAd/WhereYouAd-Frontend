import type { ICommonResponse } from "@/types/common/common";
import type {
  INaverConnectResponseData,
  INaverCredentialsRequest,
} from "@/types/integration/naver";

import { axiosInstance } from "@/lib/axiosInstance";

export async function connectNaverAccount(
  orgId: number,
  body: INaverCredentialsRequest,
): Promise<void> {
  await axiosInstance.post<ICommonResponse<INaverConnectResponseData>>(
    `/api/platform/${orgId}/accounts/naver`,
    body,
  );
}
