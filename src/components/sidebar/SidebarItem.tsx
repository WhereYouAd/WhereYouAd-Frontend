import { memo } from "react";
import { NavLink } from "react-router-dom";
import { twMerge } from "tailwind-merge";

import type { INavItem } from "@/types/navigation/navItem";

interface ISidebarItemProps {
  item: INavItem;
  isCollapsed: boolean;
  isOpen?: boolean;
  className: string;
  onClick: (id: string, hasChildren: boolean) => void;
}

export const SidebarItem = memo(function SidebarItem({
  item,
  isCollapsed,
  isOpen,
  className,
  onClick,
}: ISidebarItemProps) {
  const hasChildren = !!item.children?.length;
  const Icon = item.icon;

  const content = (
    <div
      className={twMerge(
        "flex items-center w-full",
        isCollapsed ? "justify-center" : "gap-4",
      )}
    >
      {Icon && (
        <Icon
          className={twMerge("h-6 w-6 shrink-0", isCollapsed ? "" : "ml-2")}
        />
      )}
      <span
        className={twMerge(
          "whitespace-nowrap transition-opacity duration-200",
          isCollapsed ? "opacity-0 w-0 invisible" : "opacity-100 ml-0",
        )}
      >
        {item.label}
      </span>
    </div>
  );

  // path 있는 단일 메뉴
  if (item.path) {
    return (
      <NavLink
        to={item.path}
        className={twMerge(className, "flex items-center")}
        onClick={(e) => {
          if (e.defaultPrevented) return;
          onClick(item.id, hasChildren);
        }}
      >
        {content}
      </NavLink>
    );
  }

  // path 없는 메뉴
  return (
    <button
      type="button"
      aria-haspopup={hasChildren ? "menu" : undefined}
      aria-expanded={hasChildren ? isOpen : undefined}
      className={twMerge(className, "flex items-center text-left")}
      onClick={(e) => {
        if (e.defaultPrevented) return;
        onClick(item.id, hasChildren);
      }}
    >
      {content}
    </button>
  );
});
