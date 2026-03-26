import { Outlet } from "react-router-dom";

import OnboardingIntro from "@/components/auth/intro/OnboardingIntro";

export default function AuthLayout() {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <div className="flex w-[45%] tablet:hidden">
        <OnboardingIntro />
      </div>

      <div className="flex-1 h-full overflow-y-auto bg-white">
        <div className="flex min-h-full items-center justify-center py-12">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
