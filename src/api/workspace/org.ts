import type { ICommonResponse } from "@/types/common/common";
import {
  type TCreateOrgRequest,
  type TCreateOrgResponse,
  type TDeleteWorkspaceMemberResponse,
  type TGetOrgResponse,
  type TGetWorkspaceMembersData,
  type TInviteMemberRequest,
  type TInviteMemberResponse,
  type TMyOrgsData,
  type TUpdateMemberRoleRequest,
  type TUpdateMemberRoleResponse,
  type TUpdateWorkspaceRequest,
  type TUploadImageResponse,
  type TWorkspace,
  type TWorkspaceDetail,
  type TWorkspaceMemberCount,
} from "@/types/workspace/workspace";

import { axiosInstance } from "@/lib/axiosInstance";

export const getMyWorkspaces = async (): Promise<TWorkspace[]> => {
  const { data } =
    await axiosInstance.get<ICommonResponse<TMyOrgsData>>("/api/org/my");
  return data.data.organizations;
};

export const createWorkspace = async (
  body: TCreateOrgRequest,
): Promise<TCreateOrgResponse> => {
  const { data } = await axiosInstance.post<
    ICommonResponse<TCreateOrgResponse>
  >("/api/org/create", body);
  return data.data;
};

export const getWorkspace = async (
  orgId: number,
): Promise<TWorkspaceDetail> => {
  const { data } = await axiosInstance.get<ICommonResponse<TGetOrgResponse>>(
    `/api/org/${orgId}`,
  );

  return data.data;
};

export const updateWorkspace = async (
  orgId: number,
  body: TUpdateWorkspaceRequest,
): Promise<void> => {
  await axiosInstance.patch<ICommonResponse<string>>(`/api/org/${orgId}`, body);
};

export const deleteWorkspace = async (orgId: number): Promise<void> => {
  await axiosInstance.delete<ICommonResponse<string>>(`/api/org/${orgId}`);
};

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("image", file);
  const { data } = await axiosInstance.post<
    ICommonResponse<TUploadImageResponse>
  >(`/api/images/upload`, formData);
  return data.data.url;
};

export const getWorkspaceMembers = async (
  orgId: number,
  cursor?: string | null,
  size = 20,
): Promise<TGetWorkspaceMembersData> => {
  const params: Record<string, string | number> = { size };
  if (cursor) {
    params.cursor = cursor;
  }
  const { data } = await axiosInstance.get<
    ICommonResponse<TGetWorkspaceMembersData>
  >(`/api/org/members/${orgId}`, { params });
  return data.data;
};

export const getWorkspaceMemberCount = async (
  orgId: number,
): Promise<TWorkspaceMemberCount> => {
  const { data } = await axiosInstance.get<
    ICommonResponse<TWorkspaceMemberCount>
  >(`/api/org/members/${orgId}/count`);
  return data.data;
};

export const updateWorkspaceMemberPermission = async (
  orgId: number,
  memberId: number,
  body: TUpdateMemberRoleRequest,
): Promise<TUpdateMemberRoleResponse> => {
  const { data } = await axiosInstance.patch<
    ICommonResponse<TUpdateMemberRoleResponse>
  >(`/api/org/members/${orgId}/${memberId}`, body);

  return data.data;
};

export const deleteWorkspaceMember = async (
  orgId: number,
  memberId: number,
): Promise<TDeleteWorkspaceMemberResponse> => {
  const { data } = await axiosInstance.delete<
    ICommonResponse<TDeleteWorkspaceMemberResponse>
  >(`/api/org/${orgId}/members/${memberId}`);

  return data.data;
};

export const postInviteEmail = async (
  orgId: number,
  body: TInviteMemberRequest,
): Promise<TInviteMemberResponse> => {
  const { data } = await axiosInstance.post<
    ICommonResponse<TInviteMemberResponse>
  >(`/api/org/members/${orgId}/invitation`, body);
  return data.data;
};

export const getSavedWorkspace = async () => {
  const { data } = await axiosInstance.get<ICommonResponse<{ orgId: number }>>(
    "/api/org/my/workspace",
  );
  return data.data;
};

export const saveSelectedWorkspace = async (orgId: number): Promise<void> => {
  await axiosInstance.post(`/api/org/${orgId}/workspace`);
};
