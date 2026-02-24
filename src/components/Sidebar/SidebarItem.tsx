import React from "react";
import { NavLink } from "react-router-dom";

import type { INavItem } from "@/types/navigation/navItem";

interface ISidebarItemProps {
  item: INavItem;
  isCollapsed: boolean;
  isOpen?: boolean;
  className: string;
  onClick: () => void;
  children?: React.ReactNode;
}

export function SidebarItem({
  item,
  isCollapsed,
  isOpen,
  className,
  onClick,
  children,
}: ISidebarItemProps) {
  const Icon = item.icon;

  const content = (
    <div
      className={[
        "flex items-center w-full",
        isCollapsed ? "justify-center" : "gap-4",
      ].join(" ")}
    >
      {Icon && (
        <Icon
          className={[
            "h-6 w-6 shrink-0 transition-all duration-400",
            isCollapsed ? "" : "ml-2",
          ].join(" ")}
        />
      )}
      <span
        className={[
          "whitespace-nowrap transition-all duration-300 ease-in-out",
          isCollapsed ? "opacity-0 w-0 invisible" : "opacity-100 ml-0",
        ].join(" ")}
      >
        {item.label}
      </span>
      {children}
    </div>
  );

  // path 있는 단일 메뉴
  if (item.path) {
    return (
      <NavLink
        to={item.path}
        className={() => className}
        onClick={(e) => {
          if (e.defaultPrevented) return;
          onClick();
        }}
      >
        <div className="flex w-full items-center">{content}</div>
      </NavLink>
    );
  }

  // path 없는 메뉴
  return (
    <button
      type="button"
      aria-haspopup="true"
      aria-expanded={isOpen}
      className={className}
      onClick={(e) => {
        if (e.defaultPrevented) return;
        onClick();
      }}
    >
      {content}
    </button>
  );
}
