import type { Dispatch, FocusEvent, SetStateAction } from "react";
import { useCallback, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { twMerge } from "tailwind-merge";

import { footerNav, mainNav } from "@/constants/sidebarNav";

import { mainNavSidebar } from "@/utils/navigation/mainNavSidebar";
import { isPathMatch } from "@/utils/navigation/pathMatch";
import { applyWorkspacePathsToNav } from "@/utils/navigation/workspaceNavPaths";

import { useComingSoon } from "@/hooks/common/useComingSoon";
import { useSidebar } from "@/hooks/sidebar/useSidebar";

import { SidebarItem } from "./SidebarItem";
import { SubMenu } from "./SubMenu";
import { WorkspaceSwitcher } from "./WorkspaceSwitcher";

import CollapseIcon from "@/assets/icon/chevron/chervon-left.svg?react";
import ChevronIcon from "@/assets/icon/chevron/chevron-up.svg?react";
import useWorkspaceStore from "@/store/useWorkspaceStore";

function getMainItemClass(isActive: boolean, isCollapsed: boolean) {
  return twMerge(
    "flex cursor-pointer items-center rounded-2xl px-3 font-body2 transition-colors duration-200",
    isCollapsed
      ? "h-[55px] w-[55px] mx-auto flex justify-center"
      : "h-[55px] gap-4 px-3",
    isActive
      ? "bg-primary-400 text-surface-100"
      : "text-text-auth-sub hover:bg-surface-200",
  );
}

function getFooterItemClass(isActive: boolean, isCollapsed: boolean) {
  return twMerge(
    "flex h-[55px] w-full cursor-pointer items-center rounded-2xl px-3 font-body2 transition-all duration-200",
    isCollapsed ? "justify-center px-0" : "gap-4 px-3",
    isActive ? "text-primary-400" : "text-text-auth-sub hover:text-primary-400",
  );
}

function collapsedSubmenuInteractionProps(
  enabled: boolean,
  itemId: string,
  setOpenId: Dispatch<SetStateAction<string | null>>,
) {
  if (!enabled) return {};
  return {
    onMouseEnter: () => setOpenId(itemId),
    onMouseLeave: () => setOpenId(null),
    onFocusCapture: () => setOpenId(itemId),
    onBlurCapture: (e: FocusEvent<HTMLDivElement>) => {
      if (e.currentTarget.contains(e.relatedTarget as Node | null)) return;
      setOpenId(null);
    },
  };
}

export default function Sidebar() {
  const {
    isCollapsed,
    openId,
    setOpenId,
    handleItemClick,
    pathname,
    toggleSidebar,
    toggleOpenId,
  } = useSidebar();

  const { showComingSoon } = useComingSoon();

  const selectedOrgId = useWorkspaceStore((s) => s.selectedOrgId);
  const mainNavWithWorkspace = useMemo(
    () => applyWorkspacePathsToNav(mainNav, selectedOrgId),
    [selectedOrgId],
  );

  const handleFooterItemClick = useCallback(
    (id: string, hasChildren: boolean) => {
      if (id === "notifications") {
        showComingSoon("알림 기능은 준비 중이에요. 나중에 다시 확인해 주세요.");
        return;
      }
      handleItemClick(id, hasChildren);
    },
    [handleItemClick, showComingSoon],
  );

  return (
    <motion.div
      className={twMerge(
        "relative z-40 flex h-full flex-col bg-surface-100 border-r border-surface-300",
      )}
      initial={false}
      animate={{ width: isCollapsed ? 88 : 256 }}
      transition={{ type: "spring", stiffness: 320, damping: 34 }}
    >
      <div className="mx-auto mt-5 flex w-full max-w-58 flex-1 flex-col min-h-0">
        <div className="px-2">
          <WorkspaceSwitcher isCollapsed={isCollapsed} />
        </div>

        <nav
          aria-label="사이드바 내비게이션"
          className={twMerge(
            "flex flex-1 flex-col gap-1 px-2 min-h-0",
            isCollapsed
              ? "overflow-visible"
              : "overflow-y-auto overflow-x-hidden",
          )}
        >
          {mainNavWithWorkspace.map((item) => {
            const isOpen = openId === item.id;
            const { isParentActive } = mainNavSidebar.getItemActiveState(
              pathname,
              item,
            );

            const showChevron =
              !isCollapsed &&
              !!item.children?.length &&
              (isOpen || isParentActive);

            return (
              <div
                key={item.id}
                className="relative flex flex-col"
                {...collapsedSubmenuInteractionProps(
                  isCollapsed && !!item.children?.length,
                  item.id,
                  setOpenId,
                )}
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
                        toggleOpenId(item.id);
                      }}
                      className={twMerge(
                        "ml-auto shrink-0 rounded-lg p-2 transition-colors",
                        isParentActive
                          ? "text-surface-100 hover:bg-surface-100/20"
                          : "hover:bg-surface-200",
                      )}
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

        <div
          className={twMerge("mt-2 pb-3 shrink-0", isCollapsed ? "" : "px-2")}
        >
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
                  onClick={handleFooterItemClick}
                />
              </div>
            );
          })}

          <div className="mt-2 pt-2 border-t border-surface-300">
            <button
              type="button"
              aria-label={isCollapsed ? "사이드바 펼치기" : "사이드바 접기"}
              onClick={toggleSidebar}
              className={twMerge(
                "inline-flex h-14 w-full items-center rounded-2xl font-body2 transition-all duration-200",
                isCollapsed ? "justify-center px-0" : "gap-4 px-3",
                "text-text-auth-sub hover:text-primary-400 hover:bg-surface-200",
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
