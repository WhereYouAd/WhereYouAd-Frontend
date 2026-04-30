import { AnimatePresence, motion } from "framer-motion";
import { twMerge } from "tailwind-merge";

import { footerNav, mainNav } from "@/constants/sidebarNav";

import { isPathMatch, normalizePathname } from "@/utils/navigation/pathMatch";

import { useSidebar } from "@/hooks/sidebar/useSidebar";

import { SidebarItem } from "./SidebarItem";
import { SubMenu } from "./SubMenu";
import { WorkspaceSwitcher } from "./WorkspaceSwitcher";

import CollapseIcon from "@/assets/icon/chevron/chervon-left.svg?react";
import ChevronIcon from "@/assets/icon/chevron/chevron-up.svg?react";
// import Logo from "@/assets/logo/symbol-color.svg?react";

function getMainItemClass(isActive: boolean, isCollapsed: boolean) {
  return twMerge(
    "flex items-center rounded-component-md px-3 text-sm cursor-pointer transition-colors duration-200",
    isCollapsed
      ? "h-[55px] w-[55px] mx-auto flex justify-center"
      : "h-[55px] gap-4 px-3",
    isActive
      ? "bg-chart-3 text-white"
      : "text-text-auth-sub hover:bg-bg-surface",
  );
}

function getFooterItemClass(isActive: boolean, isCollapsed: boolean) {
  return twMerge(
    "flex w-full h-[55px] items-center rounded-component-md px-3 text-sm cursor-pointer transition-all duration-200",
    isCollapsed ? "justify-center px-0" : "gap-4 px-3",
    isActive ? "text-chart-3" : "text-text-auth-sub hover:text-chart-3",
  );
}

export default function Sidebar() {
  const {
    isCollapsed,
    openId,
    setOpenId,
    handleItemClick,
    getItemActiveState,
    location,
    toggleSidebar,
  } = useSidebar();

  const pathname = normalizePathname(location.pathname);

  return (
    <motion.div
      className={twMerge(
        "relative z-40 flex h-full flex-col bg-white border-r border-bg-surface",
      )}
      initial={false}
      animate={{ width: isCollapsed ? 88 : 256 }}
      transition={{ type: "spring", stiffness: 320, damping: 34 }}
    >
      <div className="mx-auto mt-5 flex w-full max-w-58 flex-1 flex-col">
        {/* Top */}
        <div className="px-2">
          <WorkspaceSwitcher isCollapsed={isCollapsed} />
        </div>

        {/* Main */}
        <nav className="flex flex-1 flex-col gap-1 px-2">
          {mainNav.map((item) => {
            const isOpen = openId === item.id;
            const { isParentActive } = getItemActiveState(item);

            const showChevron =
              !isCollapsed &&
              !!item.children?.length &&
              (isOpen || isParentActive);

            return (
              <div
                key={item.id}
                className="relative flex flex-col"
                onMouseEnter={() => isCollapsed && setOpenId(item.id)}
                onMouseLeave={() => isCollapsed && setOpenId(null)}
                onFocusCapture={() => {
                  if (!isCollapsed) return;
                  if (!item.children?.length) return;
                  setOpenId(item.id);
                }}
                onBlurCapture={(e) => {
                  if (!isCollapsed) return;
                  if (!item.children?.length) return;
                  if (e.currentTarget.contains(e.relatedTarget as Node | null))
                    return;
                  setOpenId(null);
                }}
              >
                <div className={getMainItemClass(isParentActive, isCollapsed)}>
                  <SidebarItem
                    item={item}
                    isCollapsed={isCollapsed}
                    isOpen={isOpen}
                    className="flex-1 h-full"
                    onClick={handleItemClick}
                  />
                  {showChevron && (
                    <button
                      type="button"
                      aria-label={isOpen ? "하위 메뉴 닫기" : "하위 메뉴 열기"}
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setOpenId((prev) =>
                          prev === item.id ? null : item.id,
                        );
                      }}
                      className="ml-auto p-2 hover:bg-black/5 rounded-lg transition-colors"
                    >
                      <ChevronIcon
                        className={twMerge(
                          "h-3 w-3",
                          isOpen ? "rotate-0" : "rotate-180",
                        )}
                      />
                    </button>
                  )}
                </div>

                {/* SubMenu */}
                <AnimatePresence initial={false}>
                  {isOpen && item.children ? (
                    <SubMenu
                      key={item.id}
                      items={item.children}
                      isCollapsed={isCollapsed}
                      parentLabel={item.label}
                    />
                  ) : null}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className={twMerge("mt-2 pb-3", isCollapsed ? "" : "px-2")}>
          {footerNav.map((item) => {
            const isActive =
              item.path != null ? isPathMatch(pathname, item.path) : false;

            return (
              <div
                key={item.id}
                className={getFooterItemClass(isActive, isCollapsed)}
              >
                <SidebarItem
                  item={item}
                  isCollapsed={isCollapsed}
                  className="w-full h-full"
                  onClick={handleItemClick}
                />
              </div>
            );
          })}

          <div className="mt-2 pt-2 border-t border-bg-surface">
            <button
              type="button"
              aria-label={isCollapsed ? "사이드바 펼치기" : "사이드바 접기"}
              onClick={toggleSidebar}
              className={twMerge(
                "w-full h-[55px] rounded-component-md text-sm transition-all duration-200 inline-flex items-center",
                isCollapsed ? "justify-center px-0" : "gap-4 px-3",
                "text-text-auth-sub hover:text-chart-3 hover:bg-bg-surface",
              )}
            >
              <CollapseIcon
                className={twMerge(
                  "h-5 w-5 shrink-0 transition-transform duration-200",
                  isCollapsed ? "rotate-180" : "",
                  isCollapsed ? "" : "ml-2",
                )}
              />
              <span
                className={twMerge(
                  "whitespace-nowrap transition-opacity duration-200",
                  isCollapsed ? "opacity-0 w-0 invisible" : "opacity-100 ml-0",
                )}
              >
                {isCollapsed ? "사이드바 펼치기" : "사이드바 접기"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
