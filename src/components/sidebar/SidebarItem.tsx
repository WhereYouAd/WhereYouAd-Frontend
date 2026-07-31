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
  trailing?: ReactNode;
}

export const SidebarItem = memo(function SidebarItem({
  item,
  isCollapsed,
  isOpen,
  className,
  onClick,
  trailing,
}: ISidebarItemProps) {
  const hasChildren = !!item.children?.length;
  const Icon = item.icon;

  const itemClassName = twMerge(
    className,
    "flex items-center",
    isCollapsed ? "justify-center" : "",
  );

  const content = isCollapsed ? (
    Icon ? (
      <Icon className="h-6 w-6 shrink-0" aria-hidden />
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
        onClick={(e) => {
          if (e.defaultPrevented) return;
          onClick(item.id, hasChildren);
        }}
      >
        {content}
      </NavLink>
    );
  }

  return (
    <button
      type="button"
      aria-label={item.label}
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
