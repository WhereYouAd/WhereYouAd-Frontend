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

import { authInstance } from "@/lib/axiosInstance";

export const getMyWorkspaces = async (): Promise<TWorkspace[]> => {
  const { data } =
    await authInstance.get<TApiResult<TMyOrgsData>>("/api/org/my");
  if (data.status !== "200") {
    throw new Error("워크스페이스 조회에 실패했습니다");
  }
  return data.data.organizations.map(toWorkspace);
};

export const createWorkspace = async (
  body: TCreateOrgRequest,
): Promise<TCreateOrgResponse> => {
  const { data } = await authInstance.post<TApiResult<TCreateOrgResponse>>(
    "/api/org/create",
    body,
  );
  if (data.status !== "200") {
    throw new Error("워크스페이스 생성에 실패했습니다");
  }
  return data.data;
};

export const getWorkspace = async (
  orgId: number,
): Promise<TWorkspaceDetail> => {
  const { data } = await authInstance.get<TApiResult<TGetOrgResponse>>(
    `/api/org/${orgId}`,
  );
  if (data.status !== "200") {
    if (data.status === "404_1")
      throw new Error("해당 조직은 존재하지 않습니다");
    if (data.status === "410_1") throw new Error("해당 조직은 삭제되었습니다");
    throw new Error("워크스페이스 정보를 불러오지 못했습니다");
  }
  return toWorkspaceDetail(data.data);
};

export const updateWorkspace = async (
  orgId: number,
  body: TUpdateWorkspaceRequest,
): Promise<void> => {
  const { data } = await authInstance.patch<TApiResult<string>>(
    `/api/org/${orgId}`,
    body,
  );
  if (data.status !== "200") {
    if (data.status === "404_1")
      throw new Error("해당 조직은 존재하지 않습니다");
    if (data.status === "403_1")
      throw new Error("해당 조직에 대한 권한이 없습니다.");
    throw new Error("워크스페이스 수정에 실패했습니다");
  }
};

export const deleteWorkspace = async (orgId: number): Promise<void> => {
  const { data } = await authInstance.delete<TApiResult<string>>(
    `/api/org/${orgId}`,
  );
  if (data.status !== "200") {
    if (data.status === "404_1")
      throw new Error("해당 조직은 존재하지 않습니다");
    if (data.status === "403_1")
      throw new Error("해당 조직에 대한 권한이 없습니다.");
    throw new Error("워크스페이스 삭제에 실패했습니다");
  }
};
