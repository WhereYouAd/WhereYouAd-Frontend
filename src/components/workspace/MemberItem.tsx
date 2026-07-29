import { twMerge } from "tailwind-merge";

import type {
  TMemberRole,
  TWorkspaceMember,
} from "@/types/workspace/workspace";

import MemberRoleSelect from "./MemberRoleSelect";

import BellOffIcon from "@/assets/icon/common/bell-off.svg?react";
import BellRingingIcon from "@/assets/icon/common/bell-ringing.svg?react";
import MailIcon from "@/assets/icon/common/mail.svg?react";
import TrashIcon from "@/assets/icon/common/trash.svg?react";
import UserIcon from "@/assets/icon/common/user.svg?react";

type TProps = {
  member: TWorkspaceMember;
  isReceive?: boolean;
  isNotificationLoading: boolean;
  isReceiveUpdating?: boolean;
  onRoleChange: (newRole: TMemberRole) => void;
  onDeleteClick: () => void;
  onReceiveToggle?: () => void;
};

export default function MemberItem({
  member,
  isReceive,
  isNotificationLoading,
  isReceiveUpdating = false,
  onRoleChange,
  onDeleteClick,
  onReceiveToggle,
}: TProps) {
  const canToggleReceive =
    isReceive !== undefined &&
    !isNotificationLoading &&
    !isReceiveUpdating &&
    !!onReceiveToggle;
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
          <p className="truncate font-body1 text-text-title">{member.name}</p>
          <div className="flex text-text-auth-sub items-center gap-2 min-w-0">
            <MailIcon className="w-4 h-4" />
            <p className="truncate">{member.email}</p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button
          type="button"
          disabled={!canToggleReceive}
          onClick={onReceiveToggle}
          className={twMerge(
            "inline-flex h-5 w-5 items-center justify-center",
            (isNotificationLoading || isReceiveUpdating) && "animate-pulse",
            isReceive === false && "text-text-muted opacity-70",
            isReceive === true && "text-primary-400/90",
            isReceive === undefined && "text-text-muted",
            canToggleReceive && "cursor-pointer hover:opacity-80",
            !canToggleReceive && "cursor-not-allowed",
          )}
          aria-label={
            isReceive === true
              ? "알림 수신 중"
              : isReceive === false
                ? "알림 수신 안 함"
                : "알림 설정 확인 중"
          }
          title={
            isReceive === true
              ? "알림 수신 중"
              : isReceive === false
                ? "알림 수신 안함"
                : undefined
          }
        >
          {isReceive ? (
            <BellRingingIcon className="h-5 w-5" />
          ) : (
            <BellOffIcon className="h-5 w-5" />
          )}
        </button>
        {member.isMe ? (
          <span
            className={`inline-flex h-10 min-w-24.5 items-center justify-center rounded-3xl px-4 font-body2 ${
              member.role === "ADMIN"
                ? "bg-primary-400 text-surface-100"
                : "bg-primary-100/80 text-text-auth-sub"
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
              className="text-text-muted transition-colors hover:text-info-red"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </>
        )}
      </div>
    </li>
  );
}
