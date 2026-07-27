import CopyIcon from "@/assets/icon/common/link.svg?react";
import UserIcon from "@/assets/icon/common/user.svg?react";

const MEMBERS = [
  { name: "김대표", role: "ADMIN" as const },
  { name: "박마케터", role: "MEMBER" as const },
  { name: "이디자이너", role: "MEMBER" as const },
];

export default function GuideWorkspace() {
  return (
    <div className="h-75 w-full bg-transparent md:h-85" aria-hidden="true">
      <div className="h-full rounded-[28px] bg-surface-100 border border-surface-400/60 shadow-Soft overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 pt-5 pb-3 shrink-0">
          <p className="font-heading4 text-text-title">팀원 초대하기</p>
          <div className="flex items-center gap-1.5 text-primary-500">
            <CopyIcon className="w-4 h-4" />
            <span className="font-body2">링크 복사</span>
          </div>
        </div>

        <div className="px-6 pb-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex-1 h-10 rounded-xl border border-surface-400/70 px-4 flex items-center">
              <span className="font-body2 text-text-muted">
                whereyouad@email.com
              </span>
            </div>
            <div className="shrink-0 px-4 py-2 rounded-xl bg-primary-500 font-body2 text-surface-100">
              초대
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col px-6 min-h-0">
          {MEMBERS.map((member) => (
            <div
              key={member.name}
              className="flex flex-1 items-center justify-between gap-4 border-t border-surface-400/40"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-text-placeholder/30 flex items-center justify-center shrink-0 overflow-hidden">
                  <UserIcon className="text-text-auth-sub w-5 h-5" />
                </div>
                <p className="font-body1 text-text-title">{member.name}</p>
              </div>
              <span className="font-body2 text-text-title">
                {member.role === "ADMIN" ? "관리자" : "멤버"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
