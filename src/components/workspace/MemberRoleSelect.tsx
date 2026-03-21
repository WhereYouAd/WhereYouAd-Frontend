import type { TMemberRole } from "@/types/workspace/workspace";

import {
  DropdownMenu,
  type TMenuItem,
} from "../common/dropdownmenu/DropdownMenu";

import ChevonIcon from "@/assets/icon/chevron/chevron-up.svg?react";

type TProps = {
  role: TMemberRole;
  onChange: (newRole: TMemberRole) => void;
  disabled?: boolean;
};

const roleLabelMap: Record<TMemberRole, string> = {
  ADMIN: "관리자",
  MEMBER: "멤버",
};

const triggerStyleMap: Record<TMemberRole, string> = {
  ADMIN: "bg-status-blue/80 text-white shadow-sm",
  MEMBER: "bg-chart-3/15 text-text-auth-sub",
};

export default function MemberRoleSelect({
  role,
  onChange,
  disabled = false,
}: TProps) {
  const items: TMenuItem[] = disabled
    ? []
    : [
        {
          label: "관리자",
          onClick: () => onChange("ADMIN"),
          active: role === "ADMIN",
        },
        {
          label: "멤버",
          onClick: () => onChange("MEMBER"),
          active: role === "MEMBER",
        },
      ];
  return (
    <DropdownMenu
      key={disabled ? "disabled" : "enabled"}
      items={items}
      className={disabled ? "pointer-events-none opacity-50" : undefined}
      trigger={(open) => (
        <div
          className={`flex h-10 min-w-25 items-center justify-between gap-3 rounded-component-lg px-4 font-body2 ${triggerStyleMap[role]} cursor-pointer`}
        >
          <span>{roleLabelMap[role]}</span>
          <ChevonIcon
            className={`h-4 w-4 shrink-0 transition-transform ${open ? "rotate-0" : "-rotate-180"}`}
          />
        </div>
      )}
    />
  );
}
