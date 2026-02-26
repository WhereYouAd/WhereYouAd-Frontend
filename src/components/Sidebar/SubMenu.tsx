import { NavLink } from "react-router-dom";
import { twMerge } from "tailwind-merge";

import type { INavItem } from "@/types/navigation/navItem";

interface ISubMenuProps {
  items: INavItem[];
  isCollapsed: boolean;
}

export function SubMenu({ items, isCollapsed }: ISubMenuProps) {
  const getSubItemClass = (isActive: boolean) =>
    twMerge(
      "flex h-10 items-center rounded-xl px-3 text-sm transition-all duration-200 whitespace-nowrap",
      isCollapsed ? "" : "pl-4",
      isActive
        ? "bg-chart-3 text-white"
        : "text-text-auth-sub hover:bg-[#F6F6F6]",
    );

  const menuContainerClass = isCollapsed
    ? "absolute left-full top-0 pl-2 w-52 flex flex-col gap-1 rounded-2xl bg-white p-2 shadow-lg z-50 whitespace-nowrap"
    : "ml-11 mt-1 flex flex-col gap-1 overflow-hidden transition-all duration-200";

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
