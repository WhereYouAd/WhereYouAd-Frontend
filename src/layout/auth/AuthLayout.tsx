import { Outlet } from "react-router-dom";

import OnboardingIntro from "@/components/auth/intro/OnboardingIntro";

export default function AuthLayout() {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <div className="flex w-[55%] tablet:hidden">
        <OnboardingIntro />
      </div>

      <div className="flex flex-1 items-center justify-center bg-white">
        <div className="w-full max-w-md px-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
