import { footerNav, mainNav } from "@/constants/sidebarNav";

import Logo from "@/assets/logo/symbol-color.svg?react";

export default function Sidebar() {
  return (
    <div className="flex h-full w-64 flex-col bg-white rounded-3xl drop-shadow-md">
      <div className="mx-auto flex w-full max-w-[232px] flex-1 flex-col">
        <div className="mt-5 mb-2 flex h-16 items-center gap-3 px-4">
          <Logo className="h-12 w-12" />
          <span className="text-xl font-semibold">WhereYouAd</span>
        </div>

        {/* Main */}
        <nav className="flex flex-1 flex-col gap-1 px-2">
          {mainNav.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                className="flex h-[55px] items-center gap-4 rounded-xl px-3 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors"
              >
                {Icon && <Icon className="ml-2 h-6 w-6" />}
                <span>{item.label}</span>
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-2 py-2 mb-3">
          {footerNav.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                className="flex h-[55px] items-center gap-3 rounded-xl px-3 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors"
              >
                {Icon && <Icon className="ml-2 h-6 w-6" />}
                <span>{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
