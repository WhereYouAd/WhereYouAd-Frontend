import { NavLink } from "react-router-dom";

import type { INavItem } from "@/types/navigation/navItem";

interface ISubMenuProps {
  items: INavItem[];
  isCollapsed: boolean;
}

export function SubMenu({ items, isCollapsed }: ISubMenuProps) {
  const getSubItemClass = (isActive: boolean) =>
    [
      "flex h-10 items-center rounded-xl pl-4 px-3 text-sm transition-colors",
      isCollapsed ? "" : "pl-4",
      isActive
        ? "bg-chart-3 text-white"
        : "text-text-auth-sub hover:bg-[#F6F6F6]",
    ].join(" ");

  const menuContainerClass = isCollapsed
    ? "absolute left-full top-0 pl-2 w-52 flex flex-col gap-1 rounded-2xl bg-white p-2 shadow-lg z-50"
    : "ml-11 mt-1 flex flex-col gap-1";

  return (
    <div className={menuContainerClass}>
      {items.map((child) => (
        <NavLink
          key={child.id}
          to={child.path ?? "#"}
          end
          className={({ isActive }) => getSubItemClass(isActive)}
        >
          {child.label}
        </NavLink>
      ))}
    </div>
  );
}
