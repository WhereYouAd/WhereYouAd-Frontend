import type { ICommonResponse } from "@/types/common/common";
import {
  type TCreateOrgRequest,
  type TCreateOrgResponse,
  type TGetOrgResponse,
  type TMyOrgsData,
  type TUpdateWorkspaceRequest,
  type TUploadImageResponse,
  type TWorkspace,
  type TWorkspaceDetail,
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
