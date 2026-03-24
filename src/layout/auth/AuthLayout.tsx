import { Outlet } from "react-router-dom";

import OnboardingIntro from "@/components/auth/intro/OnboardingIntro";

export default function AuthLayout() {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <div className="flex w-[55%] tablet:hidden">
        <OnboardingIntro />
      </div>

      <div className="flex-1 overflow-y-auto bg-white">
        <div className="flex min-h-full items-center justify-center">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
