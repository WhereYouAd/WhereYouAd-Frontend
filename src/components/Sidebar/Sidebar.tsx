import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

import { footerNav, mainNav } from "@/constants/sidebarNav";

import ChevronIcon from "@/assets/icon/common/chevron-up.svg?react";
import Logo from "@/assets/logo/symbol-color.svg?react";

function getMainItemClass(isActive: boolean) {
  return [
    "flex h-[55px] items-center gap-4 rounded-xl px-3 text-sm cursor-pointer transition-colors",
    isActive
      ? "bg-chart-3 text-white"
      : "text-text-auth-sub hover:bg-[#F6F6F6]",
  ].join(" ");
}

function getFooterItemClass(isActive: boolean) {
  return [
    "flex h-[55px] items-center gap-4 rounded-xl px-3 text-sm cursor-pointer transition-colors",
    isActive ? "text-chart-3" : "text-text-auth-sub hover:text-chart-3",
  ].join(" ");
}

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    const activeParent = mainNav.find((item) =>
      item.children?.some((c) => c.path === location.pathname),
    );

    if (activeParent) setOpenId(activeParent.id);
  }, [location.pathname]);

  return (
    <div className="flex h-full w-64 flex-col bg-white rounded-3xl drop-shadow-md">
      <div className="mx-auto flex w-full max-w-[232px] flex-1 flex-col">
        <NavLink to="/" className="mt-5 mb-2 flex h-16 items-center gap-3 px-4">
          <Logo className="h-12 w-12" />
          <span className="text-xl font-semibold">WhereYouAd</span>
        </NavLink>

        {/* Main */}
        <nav className="flex flex-1 flex-col gap-1 px-2">
          {mainNav.map((item) => {
            const Icon = item.icon;

            const isOpen = openId === item.id;
            const isChildActive =
              item.children?.some((c) => c.path === location.pathname) ?? false;

            const isParentActive =
              (item.path && location.pathname === item.path) || isChildActive;
            const showChevron =
              !!item.children?.length && (isOpen || isParentActive);

            // children 있는 부모 메뉴
            if (item.children?.length) {
              return (
                <div key={item.id} className="flex flex-col">
                  <div className={getMainItemClass(isParentActive)}>
                    <button
                      type="button"
                      onClick={() => {
                        setOpenId(item.id);
                        if (item.path) navigate(item.path);
                      }}
                      className="flex flex-1 items-center gap-4"
                    >
                      {Icon && <Icon className="ml-2 h-6 w-6 shrink-0" />}
                      <span>{item.label}</span>
                    </button>

                    {showChevron && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
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
                  </div>

                  {/* 하위 메뉴 */}
                  {isOpen && (
                    <div className="ml-11 mt-1 flex flex-col gap-1">
                      {item.children.map((child) => (
                        <NavLink
                          key={child.id}
                          to={child.path ?? "#"}
                          end={child.path === item.path}
                          className={({ isActive }) =>
                            [
                              "pl-4 flex h-10 items-center rounded-xl px-3 text-sm transition-colors",
                              isActive
                                ? "bg-chart-3 text-white"
                                : "text-text-auth-sub hover:bg-[#F6F6F6]",
                            ].join(" ")
                          }
                        >
                          {child.label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            // path 있는 단일 메뉴
            if (item.path) {
              return (
                <NavLink
                  key={item.id}
                  to={item.path}
                  className={({ isActive }) => getMainItemClass(isActive)}
                >
                  {Icon && <Icon className="ml-2 h-6 w-6 shrink-0" />}
                  <span>{item.label}</span>
                </NavLink>
              );
            }
            // path 없는 메뉴
            return (
              <button
                key={item.id}
                type="button"
                className={getMainItemClass(false)}
              >
                {Icon && <Icon className="ml-2 h-6 w-6 shrink-0" />}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-2 py-2 mb-3">
          {footerNav.map((item) => {
            const Icon = item.icon;

            if (item.path) {
              return (
                <NavLink
                  key={item.id}
                  to={item.path}
                  onClick={() => setOpenId(null)}
                  className={({ isActive }) => getFooterItemClass(isActive)}
                >
                  {Icon && <Icon className="ml-2 h-6 w-6 shrink-0" />}
                  <span>{item.label}</span>
                </NavLink>
              );
            }

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setOpenId(null)}
                className={getFooterItemClass(false)}
              >
                {Icon && <Icon className="ml-2 h-6 w-6 shrink-0" />}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
