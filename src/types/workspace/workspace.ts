export type TMemberRole = "ADMIN" | "MEMBER";

export type TWorkspace = {
  orgId: number;
  name: string;
  description: string;
  url?: string | null;
  logoUrl?: string | null;
  myRole: TMemberRole;
  isCurrentWorkspace: boolean;
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

export type TUploadImageResponse = {
  url: string;
};

export type TWorkspaceMember = {
  memberId: number;
  name: string;
  email: string;
  profileImageUrl: string | null;
  role: TMemberRole;
  isMe?: boolean;
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

export type TPermissionKey =
  | "campaignView"
  | "billingManage"
  | "workspaceView"
  | "memberInvite"
  | "memberRoleEdit"
  | "workspaceEdit"
  | "projectDelete";

export type TPermissionRow = {
  key: TPermissionKey;
  label: string;
  description: string;
  defaultMemberEnabled: boolean;
};

export type TInviteMemberRequest = {
  email: string;
};

export type TInviteMemberResponse = {
  orgId: number;
  message: string;
  email: string;
};

export type TInviteMemberItem =
  | {
      invitationId: number;
      email: string;
      invitedAt: string;
      expireAt: string;
      inviteStatus: "PENDING";
    }
  | {
      memberId: number;
      name: string;
      email: string;
      profileImageUrl: string | null;
      role: TMemberRole;
      inviteStatus: "ACTIVE";
      isMe?: boolean;
    };

export type TPendingMemberData = {
  invitationId: number;
  email: string;
  invitedAt: string;
  expireAt: string;
};

export type TPendingMemberResponse = {
  pendingMembers: TPendingMemberData[];
};
