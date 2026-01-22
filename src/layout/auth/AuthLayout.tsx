import { Outlet } from "react-router-dom";
import OnboardingIntro from "@/components/auth/OnboardingIntro";

export default function AuthLayout() {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <div className="hidden w-[1100px] 2xl:flex">
        <OnboardingIntro />
      </div>
      <div className="flex w-full items-center justify-center bg-white 2xl:w-[calc(100%-1000px)]">
        <div className="w-full max-w-md px-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

