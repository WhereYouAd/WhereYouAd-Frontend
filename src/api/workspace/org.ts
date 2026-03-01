import { toWorkspace, toWorkspaceDetail } from "@/types/workspace/mapper";
import type {
  TApiResult,
  TCreateOrgRequest,
  TCreateOrgResponse,
  TGetOrgResponse,
  TMyOrgsData,
  TUpdateWorkspaceRequest,
  TWorkspace,
  TWorkspaceDetail,
} from "@/types/workspace/workspace";

import { axiosInstance } from "@/lib/axiosInstance";

export const getMyWorkspaces = async (): Promise<TWorkspace[]> => {
  const { data } =
    await axiosInstance.get<TApiResult<TMyOrgsData>>("/api/org/my");
  return data.data.organizations.map(toWorkspace);
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

  return toWorkspaceDetail(data.data);
};

export const updateWorkspace = async (
  orgId: number,
  body: TUpdateWorkspaceRequest,
): Promise<void> => {
  const { data } = await axiosInstance.patch<TApiResult<string>>(
    `/api/org/${orgId}`,
    body,
  );
};

export const deleteWorkspace = async (orgId: number): Promise<void> => {
  const { data } = await axiosInstance.delete<TApiResult<string>>(
    `/api/org/${orgId}`,
  );
};
