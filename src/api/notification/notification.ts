import type { ICommonResponse } from "@/types/common/common";
import type {
  IMyNotificationSettings,
  INotificationMembersData,
  INotificationMembersParams,
  IUpdateAlertsNotificationSettingsRequest,
  IUpdateChannelNotificationSettingsRequest,
  IUpdateMasterNotificationSettingRequest,
  IUpdateNotificationMembersRequest,
  IUpdateOrgNotificationSettingsRequest,
  TNotificationEmptyData,
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

//알림 채널 설정 변경
export const updateChannelNotificationSettings = async (
  orgId: number,
  body: IUpdateChannelNotificationSettingsRequest,
): Promise<TNotificationEmptyData> => {
  const { data } = await axiosInstance.patch<
    ICommonResponse<TNotificationEmptyData>
  >(`/api/notification/settings/${orgId}/channels`, body);
  return data.data;
};

//알림 목표 설정 변경
export const updateAlertsNotificationSettings = async (
  orgId: number,
  body: IUpdateAlertsNotificationSettingsRequest,
): Promise<TNotificationEmptyData> => {
  const { data } = await axiosInstance.patch<
    ICommonResponse<TNotificationEmptyData>
  >(`/api/notification/settings/${orgId}/alerts`, body);
  return data.data;
};

//멤버 알림 수신 여부 변경
export const updateNotificationMembers = async (
  orgId: number,
  body: IUpdateNotificationMembersRequest,
): Promise<TNotificationEmptyData> => {
  const { data } = await axiosInstance.patch<
    ICommonResponse<TNotificationEmptyData>
  >(`/api/notification/settings/${orgId}/members`, body);
  return data.data;
};

//조직 알림 설정 변경
export const updateOrgNotificationSettings = async (
  orgId: number,
  body: IUpdateOrgNotificationSettingsRequest,
): Promise<TNotificationEmptyData> => {
  const { data } = await axiosInstance.patch<
    ICommonResponse<TNotificationEmptyData>
  >(`/api/notification/settings/${orgId}/org`, body);
  return data.data;
};

//마스터 컨트롤 변경
export const updateMasterNotificationSetting = async (
  orgId: number,
  body: IUpdateMasterNotificationSettingRequest,
): Promise<TNotificationEmptyData> => {
  const { data } = await axiosInstance.patch<
    ICommonResponse<TNotificationEmptyData>
  >(`/api/notification/settings/${orgId}/master`, body);
  return data.data;
};
