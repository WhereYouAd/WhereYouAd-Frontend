import type { ReactNode } from "react";

import Badge from "@/components/common/badge/Badge";

import GoogleLogo from "@/assets/logo/social-logo/circle/google-circle.svg?react";
import MetaLogo from "@/assets/logo/social-logo/circle/meta-circle.svg?react";
import NaverLogo from "@/assets/logo/social-logo/circle/naver-circle.svg?react";

const PLATFORMS: {
  id: string;
  name: string;
  logo: ReactNode;
  connected: boolean;
}[] = [
  {
    id: "naver",
    name: "NAVER",
    logo: <NaverLogo className="w-10 h-10" />,
    connected: true,
  },
  {
    id: "meta",
    name: "Meta",
    logo: <MetaLogo className="w-10 h-10" />,
    connected: false,
  },
  {
    id: "google",
    name: "Google",
    logo: <GoogleLogo className="w-10 h-10" />,
    connected: false,
  },
];

export default function GuidePlatform() {
  return (
    <div className="h-75 w-full md:h-85 flex flex-col gap-3 py-1.5">
      {PLATFORMS.map((platform) => (
        <div
          key={platform.id}
          className="flex flex-1 items-center gap-4 rounded-2xl bg-surface-100 px-5 border border-surface-400/40"
        >
          {platform.logo}
          <span className="flex-1 font-body2 text-text-title">
            {platform.name}
          </span>
          <Badge variant={platform.connected ? "infoBlue" : "surface"}>
            {platform.connected ? "연동됨" : "미연동"}
          </Badge>
          {!platform.connected && (
            <span className="shrink-0 px-3 py-1.5 rounded-xl border border-surface-400/60 font-body2 text-text-muted">
              연동하기
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
