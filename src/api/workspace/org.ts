import type { ICommonResponse } from "@/types/common/common";
import type {
  TAcceptInvitationResponse,
  TChangeOwnerRequest,
  TChangeOwnerResponse,
  TCreateOrgRequest,
  TCreateOrgResponse,
  TDeleteWorkspaceMemberResponse,
  TGetOrgResponse,
  TGetWorkspaceMembersData,
  TInviteMemberRequest,
  TInviteMemberResponse,
  TMyOrgsData,
  TPendingMemberResponse,
  TUpdateMemberRoleRequest,
  TUpdateMemberRoleResponse,
  TUpdateWorkspaceRequest,
  TWorkspace,
  TWorkspaceDetail,
  TWorkspaceMember,
  TWorkspaceMemberCount,
} from "@/types/workspace/workspace";

import { axiosInstance } from "@/lib/axiosInstance";

const buildWorkspaceFormData = (
  request: Record<string, unknown>,
  imageFile?: File | null,
) => {
  const formData = new FormData();

  formData.append(
    "request",
    new Blob([JSON.stringify(request)], { type: "application/json" }),
  );
  if (imageFile) {
    formData.append("image", imageFile);
  }
  return formData;
};

export const getMyWorkspaces = async (): Promise<TWorkspace[]> => {
  const { data } =
    await axiosInstance.get<ICommonResponse<TMyOrgsData>>("/api/org/my");
  return data.data.organizations;
};

export const createWorkspace = async (
  body: TCreateOrgRequest,
): Promise<TCreateOrgResponse> => {
  const { imageFile, ...request } = body;
  const formData = buildWorkspaceFormData(request, imageFile);
  const { data } = await axiosInstance.post<
    ICommonResponse<TCreateOrgResponse>
  >("/api/org/create", formData);
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
  const { imageFile, ...request } = body;
  const formData = buildWorkspaceFormData(request, imageFile);
  await axiosInstance.patch<ICommonResponse<string>>(
    `/api/org/${orgId}`,
    formData,
  );
};

export const deleteWorkspace = async (orgId: number): Promise<void> => {
  await axiosInstance.delete<ICommonResponse<string>>(`/api/org/${orgId}`);
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

export const getPendingMember = async (
  orgId: number,
): Promise<TPendingMemberResponse> => {
  const { data } = await axiosInstance.get<
    ICommonResponse<TPendingMemberResponse>
  >(`/api/org/members/${orgId}/pending`);

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

export const acceptInvitation = async (
  token: string,
): Promise<TAcceptInvitationResponse> => {
  const { data } = await axiosInstance.post<
    ICommonResponse<TAcceptInvitationResponse>
  >(`/api/org/invitations/${encodeURIComponent(token)}`);
  return data.data;
};

export const changeWorkspaceOwner = async (
  orgId: number,
  body: TChangeOwnerRequest,
): Promise<TChangeOwnerResponse> => {
  const { data } = await axiosInstance.patch<
    ICommonResponse<TChangeOwnerResponse>
  >(`/api/org/${orgId}/changeOwner`, body);

  return data.data;
};

// 양도 후보 등 전체 멤버가 필요할 때 cursor 끝까지 돌기
export const getAllWorkspaceMembers = async (
  orgId: number,
  size = 100,
): Promise<{ creatorId: number; members: TWorkspaceMember[] }> => {
  const members: TWorkspaceMember[] = [];
  let cursor: string | null = null;
  let creatorId = 0;
  let hasNext = true;

  while (hasNext) {
    const page = await getWorkspaceMembers(orgId, cursor, size);
    creatorId = page.creatorId;
    members.push(...page.members);
    hasNext = page.hasNext;
    cursor = page.nextCursor;
  }

  return { creatorId, members };
};
