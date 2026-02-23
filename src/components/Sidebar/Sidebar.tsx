import { NavLink } from "react-router-dom";

import { footerNav, mainNav } from "@/constants/sidebarNav";

import { useSidebar } from "@/hooks/sidebar/useSidebar";

import { SidebarItem } from "./SidebarItem";
import { SubMenu } from "./SubMenu";

import ChevronIcon from "@/assets/icon/common/chevron-up.svg?react";
import CollapseIcon from "@/assets/icon/sidebar/chevron-left.svg?react";
import Logo from "@/assets/logo/symbol-color.svg?react";

function getMainItemClass(isActive: boolean, isCollapsed: boolean) {
  return [
    "flex items-center rounded-xl px-3 text-sm cursor-pointer transition-colors",
    isCollapsed ? "h-13 w-13 mx-auto justify-center" : "h-[55px] gap-4 px-3",
    isActive
      ? "bg-chart-3 text-white"
      : "text-text-auth-sub hover:bg-[#F6F6F6]",
  ].join(" ");
}

function getFooterItemClass(isActive: boolean, isCollapsed: boolean) {
  return [
    "flex w-full h-[55px] items-center rounded-xl px-3 text-sm cursor-pointer transition-colors",
    isCollapsed ? "justify-center px-0" : "gap-4 px-3",
    isActive ? "text-chart-3" : "text-text-auth-sub hover:text-chart-3",
  ].join(" ");
}

export default function Sidebar() {
  const {
    isCollapsed,
    openId,
    setOpenId,
    toggleSidebar,
    handleItemClick,
    location,
  } = useSidebar();

  return (
    <div
      className={[
        "relative flex h-full flex-col bg-white rounded-3xl drop-shadow-md transition-all duration-300",
        isCollapsed ? "w-25" : "w-64",
      ].join(" ")}
    >
      <div className="mx-auto flex w-full max-w-[232px] flex-1 flex-col">
        {/* Logo */}
        <NavLink
          to="/"
          aria-label="홈으로 이동"
          className={[
            "mt-5 mb-2 flex h-16 items-center",
            isCollapsed ? "justify-center" : "gap-3 px-4",
          ].join(" ")}
        >
          <Logo className="h-12 w-12" />
          {!isCollapsed && (
            <span className="text-xl font-semibold">WhereYouAd</span>
          )}
        </NavLink>

        <button
          type="button"
          aria-label={isCollapsed ? "사이드바 펼치기" : "사이드바 접기"}
          onClick={toggleSidebar}
          className="absolute -right-3 top-10 flex h-6 w-6 items-center justify-center rounded-md bg-white border border-[#F6F6F6] transition hover:bg-[#F6F6F6]"
        >
          <CollapseIcon
            className={[
              "h-2 w-2 transition-transform duration-300",
              isCollapsed ? "rotate-180" : "",
            ].join(" ")}
          />
        </button>

        {/* Main */}
        <nav className="flex flex-1 flex-col gap-1 px-2">
          {mainNav.map((item) => {
            const isOpen = openId === item.id;
            const isChildActive =
              item.children?.some((c) => c.path === location.pathname) ?? false;
            const isParentActive =
              (item.path && location.pathname === item.path) || isChildActive;
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
              >
                <SidebarItem
                  item={item}
                  isCollapsed={isCollapsed}
                  isOpen={isOpen}
                  className={getMainItemClass(isParentActive, isCollapsed)}
                  onClick={() =>
                    handleItemClick(item.id, !!item.children?.length, item.path)
                  }
                >
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
                      className="ml-auto p-2"
                    >
                      <ChevronIcon
                        className={[
                          "h-3 w-3",
                          isOpen ? "rotate-0" : "rotate-180",
                        ].join(" ")}
                      />
                    </button>
                  )}
                </SidebarItem>

                {/* SubMenu */}
                {isOpen && item.children && (
                  <SubMenu items={item.children} isCollapsed={isCollapsed} />
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className={["py-2 mb-3", isCollapsed ? "" : "px-2"].join(" ")}>
          {footerNav.map((item) => {
            const isActive = item.path
              ? location.pathname === item.path
              : false;

            return (
              <SidebarItem
                key={item.id}
                item={item}
                isCollapsed={isCollapsed}
                className={getFooterItemClass(isActive, isCollapsed)}
                onClick={() => {
                  setOpenId(null);
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
