import { type RefObject, useState } from "react";

import type {
  TInviteMemberItem,
  TMemberRole,
  TPendingMemberData,
  TWorkspaceMember,
} from "@/types/workspace/workspace";

import InviteMemberModal from "./InviteMemberModal";
import MemberItem from "./MemberItem";
import Button from "../common/button/Button";

import PlusIcon from "@/assets/icon/common/plus.svg?react";

type TMemberListProps = {
  orgId: number;
  members: TWorkspaceMember[];
  pendingMembers: TPendingMemberData[];
  totalCount: number;
  onRoleChange: (targetMemberId: number, newRole: TMemberRole) => void;
  onDeleteClick: (member: TWorkspaceMember) => void;
  isFetchingNextPage: boolean;
  observerRef: RefObject<HTMLDivElement | null>;
};

export default function MemberList({
  orgId,
  members,
  pendingMembers,
  totalCount,
  onRoleChange,
  onDeleteClick,
  isFetchingNextPage,
  observerRef,
}: TMemberListProps) {
  const [inviteMemberOpen, setInviteMemberOpen] = useState(false);

  const openInviteMember = () => {
    setInviteMemberOpen(true);
  };
  const closeInviteMember = () => {
    setInviteMemberOpen(false);
  };

  const inviteItems: TInviteMemberItem[] = [
    ...pendingMembers.map((member) => ({
      invitationId: member.invitationId,
      email: member.email,
      invitedAt: member.invitedAt,
      expireAt: member.expireAt,
      inviteStatus: "PENDING" as const,
    })),
    ...members.map((member) => ({
      memberId: member.memberId,
      name: member.name,
      email: member.email,
      profileImageUrl: member.profileImageUrl,
      role: member.role,
      inviteStatus: "ACTIVE" as const,
      isMe: member.isMe,
    })),
  ];

  const hasVisibleItems = members.length > 0;

  return (
    <div className="bg-white border border-gray-100 rounded-component-lg p-8 shadow-Soft">
      <header className="mb-7 flex items-start justify-between gap-4">
        <div>
          <h2 className="font-heading4 text-text-main font-semibold!">
            팀 구성원
          </h2>
          <p className="font-body2 text-text-sub mt-2">
            현재 {totalCount}명의 구성원이 활동 중입니다
          </p>
        </div>
        <Button
          type="button"
          variant="primary"
          size="small"
          aria-label="팀원 초대 버튼"
          onClick={openInviteMember}
          className="p-5 py-6 rounded-component-md"
        >
          <PlusIcon className="w-3 h-3 fill-white" />
          팀원 초대
        </Button>
      </header>

      {!hasVisibleItems ? (
        <div className="flex min-h-40 items-center justify-center rounded-component-md bg-gray-50 text-text-sub">
          아직 등록된 팀원이 없습니다
        </div>
      ) : (
        <>
          <ul className="divide-y divide-gray-100">
            {members.map((member) => (
              <MemberItem
                key={member.memberId}
                member={member}
                onRoleChange={(newRole) =>
                  onRoleChange(member.memberId, newRole)
                }
                onDeleteClick={() => onDeleteClick(member)}
              />
            ))}
          </ul>
          <div ref={observerRef} className="w-full h-6" />
          {isFetchingNextPage && (
            <div className="pt-4 text-center font-body2 text-text-sub">
              팀원을 더 불러오는 중입니다...
            </div>
          )}
        </>
      )}
      <InviteMemberModal
        isOpen={inviteMemberOpen}
        onClose={closeInviteMember}
        orgId={orgId}
        inviteItems={inviteItems}
      />
    </div>
  );
}
