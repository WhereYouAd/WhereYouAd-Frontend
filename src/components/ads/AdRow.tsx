import type { ReactNode } from "react";

import type { TPlatform } from "@/types/ads/campaign";

import Badge from "../common/badge/Badge";

import GoogleLogo from "@/assets/icon/ads/google-logo.svg?react";
import KakaoLogo from "@/assets/icon/ads/kakao-logo.svg?react";
import NaverLogo from "@/assets/icon/ads/naver-logo.svg?react";
import ChevronIcon from "@/assets/icon/common/chevron-up.svg?react";

interface IAdRowProps {
  name: string;
  runStatus: "running" | "stopped";
  runStatusText: string;
  platform: TPlatform[];
  isOpen: boolean;
  onToggle: () => void;
}

const LogoMap: Record<TPlatform, ReactNode> = {
  kakao: <KakaoLogo className="w-full h-full" />,
  google: <GoogleLogo className="w-full h-full" />,
  naver: <NaverLogo className="w-full h-full" />,
};

export default function AdRow({
  name,
  runStatus,
  runStatusText,
  platform,
  isOpen,
  onToggle,
}: IAdRowProps) {
  return (
    <div
      onClick={onToggle}
      className={
        "flex items-center px-5 py-5 cursor-pointer transition-all border-t border-bg-disabled hover:bg-bg-surface"
      }
    >
      {/* status badge */}
      <div className="w-[15%] shrink-0 mr-2">
        <Badge
          variant={runStatus === "running" ? "running" : "stopped"}
          size="sm"
        >
          {runStatusText}
        </Badge>
      </div>

      {/* title */}
      <div className="w-[65%] shrink-0 pl-2">
        <span className="font-body1 truncate block">{name}</span>
      </div>

      {/* platform */}
      <div className="w-[10%] shrink-0 flex justify-end mr-5">
        {platform.map((p, idx) => (
          <div
            key={idx}
            className="flex h-8 w-8 items-center justify-center rounded-full shadow-sm overflow-hidden shrink-0"
          >
            {LogoMap[p]}
          </div>
        ))}
      </div>

      {/* chevron */}
      <div className="w-[5%] shrink-0 flex justify-end">
        <ChevronIcon
          className={`w-4 h-4 transition-transform duration-200 text-text-auth-sub ${
            isOpen ? "rotate-0" : "rotate-180"
          }`}
        />
      </div>
    </div>
  );
}
