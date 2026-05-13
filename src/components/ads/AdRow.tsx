import type { ReactNode } from "react";

import type { TPlatform } from "@/types/ads/campaign";

import Badge from "../common/badge/Badge";

import ChevronIcon from "@/assets/icon/chevron/chevron-up.svg?react";
import GoogleLogo from "@/assets/logo/social-logo/circle/google-circle.svg?react";
import KakaoLogo from "@/assets/logo/social-logo/circle/kakao-circle.svg?react";
import NaverLogo from "@/assets/logo/social-logo/circle/naver-circle.svg?react";

interface IAdRowProps {
  name: string;
  runStatus: "running" | "stopped";
  runStatusText: string;
  platform: TPlatform;
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
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={isOpen}
      className={
        "flex w-full items-center px-5 py-5 text-left cursor-pointer transition-all border-t border-bg-disabled hover:bg-bg-surface"
      }
    >
      {/* status badge */}
      <div className="w-21 shrink-0 mr-3">
        <Badge variant={runStatus === "running" ? "infoBlue" : "surface"}>
          {runStatusText}
        </Badge>
      </div>

      {/* platform */}
      <div className="w-[6%] shrink-0 flex items-center justify-center mr-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full shadow-sm overflow-hidden shrink-0">
          {LogoMap[platform]}
        </div>
      </div>

      {/* title */}
      <div className="flex-1 min-w-0 pl-3">
        <span className="font-body1 truncate block">{name}</span>
      </div>

      {/* chevron */}
      <div className="w-[5%] shrink-0 flex justify-end ml-4">
        <ChevronIcon
          className={`w-4 h-4 transition-transform duration-200 text-text-auth-sub ${
            isOpen ? "rotate-0" : "rotate-180"
          }`}
        />
      </div>
    </button>
  );
}
