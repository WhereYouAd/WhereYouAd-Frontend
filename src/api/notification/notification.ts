import type { ICommonResponse } from "@/types/common/common";
import type { IMyNotificationSettings } from "@/types/setting/notification";

import { axiosInstance } from "@/lib/axiosInstance";

//내 알림 설정 조회 API
export const getMyNotificationSettings = async (
  orgId: number,
): Promise<IMyNotificationSettings> => {
  const { data } = await axiosInstance.get<
    ICommonResponse<IMyNotificationSettings>
  >(`/api/notification/settings/${orgId}`);
  return data.data;
};
