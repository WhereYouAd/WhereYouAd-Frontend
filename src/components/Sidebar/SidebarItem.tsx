import { NavLink } from "react-router-dom";

import type { INavItem } from "@/types/navigation/navItem";

interface ISidebarItemProps {
  item: INavItem;
  isCollapsed: boolean;
  isOpen?: boolean;
  className: string;
  onClick: (id: string, hasChildren: boolean) => void;
}

export function SidebarItem({
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
      className={[
        "flex items-center w-full",
        isCollapsed ? "justify-center" : "gap-4",
      ].join(" ")}
    >
      {Icon && (
        <Icon
          className={["h-6 w-6 shrink-0", isCollapsed ? "" : "ml-2"].join(" ")}
        />
      )}
      <span
        className={[
          "whitespace-nowrap transition-opacity duration-200",
          isCollapsed ? "opacity-0 w-0 invisible" : "opacity-100 ml-0",
        ].join(" ")}
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
        className={[className, "flex items-center"].join(" ")}
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
      className={[className, "flex items-center text-left"].join(" ")}
      onClick={(e) => {
        if (e.defaultPrevented) return;
        onClick(item.id, hasChildren);
      }}
    >
      {content}
    </button>
  );
}
