import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";

import type { INavItem } from "@/types/navigation/navItem";

interface ISubMenuProps {
  items: INavItem[];
  isCollapsed: boolean;
  parentLabel?: string;
}

export function SubMenu({ items, isCollapsed, parentLabel }: ISubMenuProps) {
  const getSubItemClass = (isActive: boolean) =>
    twMerge(
      "flex items-center rounded-xl px-3 font-body2 transition-all duration-200 whitespace-nowrap",
      isCollapsed ? "h-auto py-2.5" : "h-10 pl-4",
      isActive
        ? "bg-primary-400 text-surface-100"
        : "text-text-auth-sub hover:bg-surface-200",
    );

  const menuContainerClass = isCollapsed
    ? "absolute left-full top-0 pl-2 w-52 flex flex-col gap-1 rounded-2xl bg-surface-100 p-2 shadow-Soft z-50 whitespace-nowrap"
    : "ml-11 mt-1 flex flex-col gap-1 overflow-hidden";

  const expandedMaxHeight = Math.min(640, Math.max(160, items.length * 44 + 8));

  return (
    <motion.div
      className={menuContainerClass}
      initial={
        isCollapsed
          ? { opacity: 0, x: -10, scale: 0.98 }
          : { opacity: 0, maxHeight: 0 }
      }
      animate={
        isCollapsed
          ? { opacity: 1, x: 0, scale: 1 }
          : { opacity: 1, maxHeight: expandedMaxHeight }
      }
      exit={
        isCollapsed
          ? { opacity: 0, x: -10, scale: 0.98 }
          : { opacity: 0, maxHeight: 0 }
      }
      transition={
        isCollapsed
          ? { type: "spring", stiffness: 420, damping: 34 }
          : {
              opacity: { duration: 0.12, ease: "easeOut" },
              maxHeight: { delay: 0.12, duration: 0.18, ease: "easeInOut" },
            }
      }
      style={!isCollapsed ? { overflow: "hidden" } : undefined}
    >
      {items.map((child) => (
        <NavLink
          key={child.id}
          to={child.path ?? "#"}
          end
          className={({ isActive }) => getSubItemClass(isActive)}
        >
          {isCollapsed && parentLabel ? (
            <div className="flex min-w-0 flex-col items-start">
              <span className="font-caption text-current/80 truncate max-w-full">
                {parentLabel}
              </span>
              <span className="max-w-full truncate font-label">
                {child.label}
              </span>
            </div>
          ) : (
            child.label
          )}
        </NavLink>
      ))}
    </motion.div>
  );
}
