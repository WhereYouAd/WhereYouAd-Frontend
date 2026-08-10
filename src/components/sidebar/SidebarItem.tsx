import { memo, type ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { twMerge } from "tailwind-merge";

import type { INavItem } from "@/types/navigation/navItem";

interface ISidebarItemProps {
  item: INavItem;
  isCollapsed: boolean;
  isOpen?: boolean;
  className: string;
  onClick: (id: string, hasChildren: boolean) => void;
  onNavigate?: () => void;
  trailing?: ReactNode;
  /** 연동 주의 상태 — 접힘 시 아이콘 `!` */
  showAttention?: boolean;
}

export const SidebarItem = memo(function SidebarItem({
  item,
  isCollapsed,
  isOpen,
  className,
  onClick,
  onNavigate,
  trailing,
  showAttention = false,
}: ISidebarItemProps) {
  const hasChildren = !!item.children?.length;
  const Icon = item.icon;

  const accessibilityLabel = showAttention
    ? `${item.label}, 연동 필요`
    : item.label;
  const itemClassName = twMerge(
    className,
    "flex items-center",
    isCollapsed ? "justify-center" : "",
  );

  const content = isCollapsed ? (
    Icon ? (
      <span className="relative inline-flex">
        <Icon className="h-6 w-6 shrink-0" aria-hidden />
        {showAttention ? (
          <span
            aria-hidden
            className="pointer-events-none absolute -right-1 -top-1.5 font-body2 font-bold leading-none text-info-red"
          >
            !
          </span>
        ) : null}
      </span>
    ) : null
  ) : (
    <div className="flex min-w-0 w-full items-center gap-2">
      {Icon ? <Icon className="ml-2 h-6 w-6 shrink-0" aria-hidden /> : null}
      <span className="min-w-0 flex-1 truncate whitespace-nowrap">
        {item.label}
      </span>
      {trailing ? <span className="ml-1 shrink-0">{trailing}</span> : null}
    </div>
  );

  if (item.path) {
    return (
      <NavLink
        to={item.path}
        className={itemClassName}
        // 접힘: 보이는 텍스트 없음 → 항상 label. attention이면 "연동 필요" 포함
        aria-label={
          isCollapsed || showAttention ? accessibilityLabel : undefined
        }
        onClick={(e) => {
          if (e.defaultPrevented) return;
          onClick(item.id, hasChildren);
          onNavigate?.();
        }}
      >
        {content}
      </NavLink>
    );
  }

  return (
    <button
      type="button"
      aria-label={accessibilityLabel}
      aria-haspopup={hasChildren ? "menu" : undefined}
      aria-expanded={hasChildren ? isOpen : undefined}
      className={twMerge(itemClassName, "text-left")}
      onClick={(e) => {
        if (e.defaultPrevented) return;
        onClick(item.id, hasChildren);
      }}
    >
      {content}
    </button>
  );
});
