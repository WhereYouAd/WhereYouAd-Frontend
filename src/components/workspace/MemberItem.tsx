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
    <li className="flex items-center justify-between py-5 gap-4 tablet:items-start">
      <div className="flex items-center gap-4 w-full min-w-0">
        <div className="flex bg-text-placeholder/30 h-12 w-12 items-center justify-center shrink-0 rounded-3xl overflow-hidden">
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
        <div className="min-w-0 flex-1">
          <p className="truncate text-text-main font-body1">{member.name}</p>
          <div className="flex text-text-auth-sub items-center gap-2 min-w-0">
            <MailIcon className="w-4 h-4" />
            <p className="truncate">{member.email}</p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {member.isMe ? (
          <span
            className={`inline-flex h-10 min-w-24.5 items-center justify-center rounded-3xl px-4 font-body2 ${
              member.role === "ADMIN"
                ? "bg-status-blue/80 text-white shadow-sm"
                : "bg-chart-3/15 text-text-auth-sub"
            }`}
          >
            {member.role === "ADMIN" ? "관리자" : "멤버"}
          </span>
        ) : (
          <>
            <MemberRoleSelect role={member.role} onChange={onRoleChange} />
            <button
              type="button"
              aria-label="멤버 삭제버튼"
              onClick={onDeleteClick}
              className="text-text-sub transition-colors hover:text-status-red"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </>
        )}
      </div>
    </li>
  );
}
