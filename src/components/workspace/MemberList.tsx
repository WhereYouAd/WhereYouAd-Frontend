import { useState } from "react";

import type {
  TInviteMemberItem,
  TMemberRole,
  TWorkspaceMember,
} from "@/types/workspace/workspace";

import InviteMemberModal from "./InviteMemberModal";
import MemberItem from "./MemberItem";
import Button from "../common/button/Button";

import PlusIcon from "@/assets/icon/workspace/plus.svg?react";

const mockMembers: TWorkspaceMember[] = [
  {
    name: "김택연",
    email: "himnaera@naver.com",
    profileImageUrl: null,
    role: "ADMIN",
  },
  {
    name: "문보경",
    email: "parkbogum@naver.com",
    profileImageUrl: null,
    role: "ADMIN",
  },
  {
    name: "노경은",
    email: "grandpapa@naver.com",
    profileImageUrl: null,
    role: "MEMBER",
  },
  {
    name: "조병현",
    email: "niceguy@naver.com",
    profileImageUrl: null,
    role: "MEMBER",
  },
  {
    name: "곽빈",
    email: "whathappen@naver.com",
    profileImageUrl: null,
    role: "MEMBER",
  },
];

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
};

export default function MemberList({ orgId }: TMemberListProps) {
  const [memberList, setMemberList] = useState<TWorkspaceMember[]>(mockMembers);
  const [inviteMemberOpen, setInviteMemberOpen] = useState(false);

  const handleRoleChange = (targetEmail: string, newRole: TMemberRole) => {
    setMemberList((prev) =>
      prev.map((member) =>
        member.email === targetEmail ? { ...member, role: newRole } : member,
      ),
    );
  };
  const openInviteMember = () => {
    setInviteMemberOpen(true);
  };
  const closeInviteMember = () => {
    setInviteMemberOpen(false);
  };
  return (
    <div className="bg-white border border-gray-100 rounded-component-lg p-8 shadow-Soft">
      <header className="mb-7 flex justify-between">
        <div>
          <h2 className="font-heading4 text-text-main font-semibold!">
            팀 구성원
          </h2>
          <p className="font-body2 text-text-sub mt-2">
            현재 {memberList.length}명의 구성원이 활동 중입니다
          </p>
        </div>
        <Button
          type="button"
          variant="primary"
          size="small"
          aria-label="팀원 초대 버튼"
          onClick={openInviteMember}
          // disabled={}
          className="p-5 py-6 rounded-component-md"
        >
          <PlusIcon className="w-3 h-3 fill-white" />
          팀원 초대
        </Button>
      </header>

      <ul className="divide-y divide-gray-100">
        {memberList.map((member) => (
          <MemberItem
            key={member.email}
            member={member}
            onRoleChange={(newRole) => handleRoleChange(member.email, newRole)}
          />
        ))}
      </ul>
      <InviteMemberModal
        isOpen={inviteMemberOpen}
        onClose={closeInviteMember}
        orgId={orgId}
        inviteItems={mockInviteItems}
      />
    </div>
  );
}
