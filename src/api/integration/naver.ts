import type { ICommonResponse } from "@/types/common/common";
import type {
  INaverCredentialsRequest,
  INaverCredentialsResponseData,
} from "@/types/integration/naver";

import { axiosInstance } from "@/lib/axiosInstance";

export async function connectNaverAccount(
  orgId: number,
  body: INaverCredentialsRequest,
): Promise<INaverCredentialsResponseData> {
  const { data } = await axiosInstance.post<
    ICommonResponse<INaverCredentialsResponseData>
  >(`/api/platform/${orgId}/accounts/naver`, body);

  return data.data;
}
