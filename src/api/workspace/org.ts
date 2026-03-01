import { toWorkspace } from "@/types/workspace/mapper";
import type {
  TApiResult,
  TCreateOrgRequest,
  TCreateOrgResponse,
  TMyOrgsData,
  TWorkspace,
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
