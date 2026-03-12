import { useEffect, useMemo, useRef, useState } from "react";

import type { TMemberRole } from "@/types/workspace/workspace";

import ChevronIcon from "@/assets/icon/sidebar/chevron-left.svg?react";

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
  ADMIN: "bg-chart-1/18 text-chart-1",
  MEMBER: "bg-gray-100 text-text-auth-sub",
};

export default function MemberRoleSelect({
  role,
  onChange,
  disabled = false,
}: TProps) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

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
          onClick={() => setIsOpen((prev) => !prev)}
          className={`flex h-10 min-w-[98px] items-center justify-between gap-4 px-4 font-body2 transition-all ${
            triggerStyleMap[role]
          } ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
        >
          <span>{roleLabelMap[role]}</span>
          <ChevronIcon
            className={`h-4 w-4 shrink-0  transition-transform ${isOpen ? "rotate-90" : "-rotate-90"}`}
          />
        </button>
        <div
          className={`overflow-hidden bg-gray-100 transition-all duration-200 ease-out ${isOpen && !disabled ? "max-h-10 opacity-100" : "max-h-0 opacity-0"}`}
        >
          {restOptions.map((option) => (
            <button
              type="button"
              key={option}
              onClick={() => handleSelect(option)}
              className={`flex h-10 w-full items-center justify-start px-7 font-body2 text-text-auth-sub transition-all hover:bg-gray-200`}
            >
              {roleLabelMap[option]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
