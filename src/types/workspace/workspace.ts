export type TWorkspace = {
  orgId: number;
  name: string;
  description: string;
  url?: string | null;
  logoUrl?: string | null;
  myRole: string;
};

export type TMyOrgsData = {
  organizations: TWorkspace[];
};

export type TCreateOrgRequest = {
  name: string;
  description: string;
  logoUrl?: string | null;
};

export type TCreateOrgResponse = {
  name: string;
  description: string;
  logoUrl: string | null;
};

export type TGetOrgResponse = {
  orgId: number;
  name: string;
  description: string;
  logoUrl: string | null;
  createdAt: string;
};

export type TWorkspaceDetail = TGetOrgResponse;

export type TUpdateWorkspaceRequest = {
  name: string;
  description: string;
  logoUrl: string | null;
};
export type TApiResult<T> = {
  status: string;
  data: T;
};

export type TUploadImageResponse = {
  url: string;
};

export type TMemberRole = "ADMIN" | "MEMBER";

export type TWorkspaceMember = {
  name: string;
  email: string;
  profileImageUrl: string | null;
  role: TMemberRole;
};

export type TUpdateMemberRoleRequest = {
  orgRole: TMemberRole;
};

export type TUpdateMemberRoleResponse = TWorkspaceMember;

export type TGetWorkspaceMembersData = {
  hasNext: boolean;
  nextCursor: string | null;
  members: TWorkspaceMember[];
};

export type TWorkspaceMemberCount = {
  totalCount: number;
};

export type TDeleteWorkspaceMemberResponse = string;

export type TPermissionValue = "가능" | "불가능";

export type TPermissionRow = {
  key:
    | "campaignView"
    | "billingManage"
    | "workspaceView"
    | "memberInvite"
    | "memberRoleEdit"
    | "workspaceEdit"
    | "projectDelete";
  label: string;
  description: string;
  admin: TPermissionValue;
  member: TPermissionValue;
};

export type TInviteMemberRequest = {
  email: string;
};

export type TInviteMemberResponse = {
  orgId: number;
  message: string;
  email: string;
};

export type TInviteMemberItem = {
  email: string;
  name?: string;
  profileImageUrl?: string | null;
  role?: TMemberRole;
  inviteStatus: "PENDING" | "ACTIVE";
  isMe?: boolean;
};

export type TTransferCandidate = {
  memberId: number;
  name: string;
  email: string;
  profileImageUrl?: string | null;
  role: TMemberRole;
  isMe?: boolean;
};
