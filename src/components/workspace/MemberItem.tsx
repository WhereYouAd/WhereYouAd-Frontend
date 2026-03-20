import type {
  TMemberRole,
  TWorkspaceMember,
} from "@/types/workspace/workspace";

import MemberRoleSelect from "./MemberRoleSelect";

import MailIcon from "@/assets/icon/common/mail.svg?react";
import TrashIcon from "@/assets/icon/common/trash.svg?react";
import UserIcon from "@/assets/icon/common/user.svg?react";

type TProps = {
  member: TWorkspaceMember;
  onRoleChange: (newRole: TMemberRole) => void;
  onDeleteClick: () => void;
};

export default function MemberItem({
  member,
  onRoleChange,
  onDeleteClick,
}: TProps) {
  return (
    <li className="flex items-center justify-between py-5 gap-4">
      <div className="flex items-center gap-4">
        <div className="flex bg-text-placeholder/30 h-12 w-12 items-center justify-center shrink-0 rounded-component-lg overflow-hidden">
          {member.profileImageUrl ? (
            <img
              src={member.profileImageUrl}
              alt={`${member.name} 프로필 이미지`}
              className="w-full h-full object-cover"
            />
          ) : (
            <UserIcon className="text-text-auth-sub h-6 w-6" />
          )}
        </div>
        <div className="min-w-0">
          <p className="truncate text-text-main font-body1">{member.name}</p>
          <div className=" flex text-text-auth-sub items-center gap-2">
            <MailIcon className="w-4 h-4" />
            <p className="truncate">{member.email}</p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <MemberRoleSelect role={member.role} onChange={onRoleChange} />
        {!member.isMe && (
          <button
            type="button"
            aria-label="멤버 삭제버튼"
            onClick={onDeleteClick}
            className="text-text-sub hover:text-status-red transition-all"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        )}
      </div>
    </li>
  );
}
