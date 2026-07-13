import type { ICommonResponse } from "@/types/common/common";
import type { IPlatformAccountsResponseData } from "@/types/integration/platformConnection";

import { axiosInstance } from "@/lib/axiosInstance";

export const getPlatformAccounts = async (
  orgId: number,
): Promise<IPlatformAccountsResponseData> => {
  const { data } = await axiosInstance.get<
    ICommonResponse<IPlatformAccountsResponseData>
  >(`/api/platform/${orgId}/accounts`);
  return data.data;
};

export async function disconnectPlatformAccount(
  orgId: number,
  accountId: number,
): Promise<void> {
  await axiosInstance.delete(`/api/platform/${orgId}/accounts/${accountId}`);
}

export async function reconnectPlatformAccount(
  orgId: number,
  accountId: number,
): Promise<void> {
  await axiosInstance.patch(
    `/api/platform/${orgId}/accounts/${accountId}/reconnect`,
  );
}
