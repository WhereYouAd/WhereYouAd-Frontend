import { useEffect, useId, useMemo, useRef, useState } from "react";

import type { TMemberRole } from "@/types/workspace/workspace";

import ChevronIcon from "@/assets/icon/chevron/chervon-left.svg?react";

type TProps = {
  role: TMemberRole;
  onChange: (newRole: TMemberRole) => void;
  disabled?: boolean;
};

const roleLabelMap: Record<TMemberRole, string> = {
  ADMIN: "관리자",
  MEMBER: "멤버",
};

const roleOptions: TMemberRole[] = ["ADMIN", "MEMBER"];

const triggerStyleMap: Record<TMemberRole, string> = {
  ADMIN: "bg-status-blue/80 text-white shadow-sm",
  MEMBER: "bg-chart-3/15 text-text-auth-sub",
};

export default function MemberRoleSelect({
  role,
  onChange,
  disabled = false,
}: TProps) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (disabled) {
      setIsOpen(false);
    }
  }, [disabled]);

  const restOptions = useMemo(
    () => roleOptions.filter((option) => option !== role),
    [role],
  );

  const handleSelect = (newRole: TMemberRole) => {
    onChange(newRole);
    setIsOpen(false);
  };
  return (
    <div ref={wrapperRef} className="relative">
      <div
        className={`overflow-hidden rounded-[22px]  ${disabled ? "opacity-50" : ""}`}
      >
        <button
          type="button"
          disabled={disabled}
          aria-expanded={isOpen}
          aria-haspopup="menu"
          aria-controls={isOpen && !disabled ? menuId : undefined}
          onClick={() => setIsOpen((prev) => !prev)}
          className={`flex h-10 min-w-25 items-center justify-between gap-3 rounded-[22px] px-4 font-body2 transition-colors ${
            triggerStyleMap[role]
          } ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:brightness-95"}`}
        >
          <span>{roleLabelMap[role]}</span>
          <ChevronIcon
            className={`h-4 w-4 shrink-0 transition-transform ${isOpen ? "rotate-90" : "-rotate-90"}`}
          />
        </button>
        {isOpen && !disabled && (
          <div
            id={menuId}
            role="menu"
            className="absolute left-0 top-[calc(100%+3px)] z-20 min-w-full overflow-hidden rounded-[22px] shadow-sm"
          >
            {restOptions.map((option) => (
              <button
                type="button"
                key={option}
                role="menuitem"
                onClick={() => handleSelect(option)}
                className={`flex h-10 w-full items-center justify-start px-4 font-body2 transition-colors ${triggerStyleMap[option]}`}
              >
                {roleLabelMap[option]}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
