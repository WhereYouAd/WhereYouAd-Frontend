import type { TWorkspaceMember } from "@/types/workspace/workspace";

import MemberRoleSelect from "./MemberRoleSelect";

import MailIcon from "@/assets/icon/workspace/mail.svg?react";
import TrashIcon from "@/assets/icon/workspace/trash.svg?react";
import UserIcon from "@/assets/icon/workspace/user.svg?react";

type TProps = {
  member: TWorkspaceMember;
};

export default function MemberItem({ member }: TProps) {
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
        <MemberRoleSelect
          role={member.role}
          onChange={(newRole) => {
            console.log(newRole);
          }}
        />
        <button
          type="button"
          aria-label="멤버 삭제버튼"
          onClick={() => {
            console.log("TODO:멤버삭제모달연동");
          }}
          className="text-text-sub hover:text-text-main transition-all"
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>
    </li>
  );
}
