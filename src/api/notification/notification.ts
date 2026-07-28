import type { ICommonResponse } from "@/types/common/common";
import type {
  IMyNotificationSettings,
  INotificationMembersData,
  INotificationMembersParams,
} from "@/types/setting/notification";

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

//멤버 알림 설정 목록 조회 API
export const getNotificationMembers = async (
  orgId: number,
  params?: INotificationMembersParams,
): Promise<INotificationMembersData> => {
  const { data } = await axiosInstance.get<
    ICommonResponse<INotificationMembersData>
  >(`/api/notification/settings/${orgId}/members`, {
    params: params?.cursor ? { cursor: params.cursor } : undefined,
  });
  return data.data;
};
