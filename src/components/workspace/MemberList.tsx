import { type RefObject, useState } from "react";

import type {
  TInviteMemberItem,
  TMemberRole,
  TWorkspaceMember,
} from "@/types/workspace/workspace";

import InviteMemberModal from "./InviteMemberModal";
import MemberItem from "./MemberItem";
import Button from "../common/button/Button";

import PlusIcon from "@/assets/icon/common/plus.svg?react";

const mockInviteItems: TInviteMemberItem[] = [
  {
    email: "aaa111@wya.com",
    inviteStatus: "PENDING",
  },
  {
    name: "이유찬",
    email: "uuuchan@wya.com",
    profileImageUrl: null,
    role: "ADMIN",
    inviteStatus: "ACTIVE",
    isMe: false,
  },
  {
    name: "박치국",
    email: "peach@wya.com",
    profileImageUrl: null,
    role: "MEMBER",
    inviteStatus: "ACTIVE",
    isMe: false,
  },
  {
    name: "강승호",
    email: "kang@wya.com",
    profileImageUrl: null,
    role: "MEMBER",
    inviteStatus: "ACTIVE",
    isMe: false,
  },
  {
    name: "플렉센",
    email: "flex@wya.com",
    profileImageUrl: null,
    role: "ADMIN",
    inviteStatus: "ACTIVE",
    isMe: false,
  },
  {
    name: "잭로그",
    email: "jackjack@wya.com",
    profileImageUrl: null,
    role: "MEMBER",
    inviteStatus: "ACTIVE",
    isMe: false,
  },
  {
    name: "양의지",
    email: "yang@wya.com",
    profileImageUrl: null,
    role: "ADMIN",
    inviteStatus: "ACTIVE",
    isMe: false,
  },
  {
    name: "최민석",
    email: "kkokko@wya.com",
    profileImageUrl: null,
    role: "ADMIN",
    inviteStatus: "ACTIVE",
    isMe: false,
  },
  {
    name: "양재훈",
    email: "yanghun@wya.com",
    profileImageUrl: null,
    role: "MEMBER",
    inviteStatus: "ACTIVE",
    isMe: false,
  },
];

type TMemberListProps = {
  orgId: number;
  members: TWorkspaceMember[];
  totalCount: number;
  onRoleChange: (targetMemberId: number, newRole: TMemberRole) => void;
  onDeleteClick: (member: TWorkspaceMember) => void;
  isFetchingNextPage: boolean;
  observerRef: RefObject<HTMLDivElement | null>;
};

export default function MemberList({
  orgId,
  members,
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

      {members.length === 0 ? (
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
        inviteItems={mockInviteItems}
      />
    </div>
  );
}
