import {
  type TApiResult,
  type TCreateOrgRequest,
  type TCreateOrgResponse,
  type TGetOrgResponse,
  type TGetWorkspaceMembersData,
  type TMyOrgsData,
  type TUpdateWorkspaceRequest,
  type TUploadImageResponse,
  type TWorkspace,
  type TWorkspaceDetail,
  type TWorkspaceMemberCount,
} from "@/types/workspace/workspace";

import { axiosInstance } from "@/lib/axiosInstance";

export const getMyWorkspaces = async (): Promise<TWorkspace[]> => {
  const { data } =
    await axiosInstance.get<TApiResult<TMyOrgsData>>("/api/org/my");
  return data.data.organizations;
};

export const createWorkspace = async (
  body: TCreateOrgRequest,
): Promise<TCreateOrgResponse> => {
  const { data } = await axiosInstance.post<TApiResult<TCreateOrgResponse>>(
    "/api/org/create",
    body,
  );
  return data.data;
};

export const getWorkspace = async (
  orgId: number,
): Promise<TWorkspaceDetail> => {
  const { data } = await axiosInstance.get<TApiResult<TGetOrgResponse>>(
    `/api/org/${orgId}`,
  );

  return data.data;
};

export const updateWorkspace = async (
  orgId: number,
  body: TUpdateWorkspaceRequest,
): Promise<void> => {
  await axiosInstance.patch<TApiResult<string>>(`/api/org/${orgId}`, body);
};

export const deleteWorkspace = async (orgId: number): Promise<void> => {
  await axiosInstance.delete<TApiResult<string>>(`/api/org/${orgId}`);
};

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("image", file);
  const { data } = await axiosInstance.post<TApiResult<TUploadImageResponse>>(
    `/api/images/upload`,
    formData,
  );
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
    TApiResult<TGetWorkspaceMembersData>
  >(`/api/org/members/${orgId}`, { params });
  return data.data;
};

export const getWorkspaceMemberCount = async (
  orgId: number,
): Promise<TWorkspaceMemberCount> => {
  const { data } = await axiosInstance.get<TApiResult<TWorkspaceMemberCount>>(
    `/api/org/members/${orgId}/count`,
  );
  return data.data;
};
