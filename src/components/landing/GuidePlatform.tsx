import type { ReactNode } from "react";

import GoogleLogo from "@/assets/logo/social-logo/circle/google-circle.svg?react";
import MetaLogo from "@/assets/logo/social-logo/circle/meta-circle.svg?react";
import NaverLogo from "@/assets/logo/social-logo/circle/naver-circle.svg?react";

const PLATFORMS: { id: string; name: string; logo: ReactNode }[] = [
  { id: "naver", name: "NAVER", logo: <NaverLogo className="w-10 h-10" /> },
  { id: "meta", name: "Meta", logo: <MetaLogo className="w-10 h-10" /> },
  {
    id: "google",
    name: "Google",
    logo: <GoogleLogo className="w-10 h-10" />,
  },
];

export default function GuidePlatform() {
  return (
    <div className="h-75 w-full md:h-90 flex flex-col gap-3 py-1.5">
      {PLATFORMS.map((platform) => (
        <div
          key={platform.id}
          className="flex flex-1 items-center gap-4 rounded-2xl bg-surface-100 px-5 border border-surface-400/40"
        >
          {platform.logo}
          <span className="flex-1 font-body2 text-text-title">
            {platform.name}
          </span>
          <span className="shrink-0 px-2.5 py-0.5 rounded-full bg-surface-300 font-caption text-text-muted">
            미연동
          </span>
          <span className="shrink-0 px-3 py-1.5 rounded-xl border border-surface-400/60 font-body2 text-text-muted">
            연동하기
          </span>
        </div>
      ))}
    </div>
  );
}
