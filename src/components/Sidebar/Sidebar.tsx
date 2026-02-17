import { NavLink, useLocation, useNavigate } from "react-router-dom";

import { footerNav, mainNav } from "@/constants/sidebarNav";

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

            const isParentActive =
              (item.path && location.pathname === item.path) ||
              (item.children?.some((c) => c.path === location.pathname) ??
                false);

            // children 있는 부모 메뉴
            if (item.children?.length) {
              return (
                <button
                  key={item.id}
                  type="button"
                  className={getMainItemClass(isParentActive)}
                  onClick={() => {
                    if (item.path) navigate(item.path);
                  }}
                >
                  {Icon && <Icon className="ml-2 h-6 w-6 shrink-0" />}
                  <span>{item.label}</span>
                </button>
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
