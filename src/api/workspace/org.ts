import {
  type TApiResult,
  type TCreateOrgRequest,
  type TCreateOrgResponse,
  type TGetOrgResponse,
  type TMyOrgsData,
  type TUpdateWorkspaceRequest,
  type TUploadImageResponse,
  type TWorkspace,
  type TWorkspaceDetail,
} from "@/types/workspace/workspace";

import { authInstance, axiosInstance } from "@/lib/axiosInstance";

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
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return data.data.url;
};
