import type { ReactNode } from "react";

import type { TCampaignStatus, TPlatform } from "@/types/ads/campaign";

import Badge from "../common/badge/Badge";
import ProgressBar from "../common/progressbar/ProgressBar";

import GoogleLogo from "@/assets/icon/ads/google-logo.svg?react";
import KakaoLogo from "@/assets/icon/ads/kakao-logo.svg?react";
import NaverLogo from "@/assets/icon/ads/naver-logo.svg?react";

interface ICampaignRowProps {
  platforms: TPlatform[];
  name: string;
  status: TCampaignStatus;
  statusText: string;
  progress: number;
  onClick?: () => void;
}

const LogoMap: Record<TPlatform, ReactNode> = {
  kakao: <KakaoLogo className="w-full h-full" />,
  google: <GoogleLogo className="w-full h-full" />,
  naver: <NaverLogo className="w-full h-full" />,
};

export default function CampaignRow({
  platforms,
  name,
  status,
  statusText,
  progress,
  onClick,
}: ICampaignRowProps) {
  return (
    <li
      className="flex items-center px-7 py-5 border-b border-bg-disabled hover:bg-gray-50 hover:cursor-pointer transition-colors list-none"
      onClick={onClick}
      role="button"
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {/* 플랫폼 */}
      <div className="flex w-[20%] shrink-0">
        {platforms.map((p, idx) => (
          <div
            key={idx}
            className="flex h-8 w-8 mr-3 items-center justify-center rounded-full shadow-sm overflow-hidden shrink-0"
          >
            {LogoMap[p]}
          </div>
        ))}
      </div>

      {/* 캠페인 명 */}
      <div className="w-[35%] min-w-0 pr-10 shrink-0">
        <div className="font-body1 text-text-main truncate">{name}</div>
      </div>

      {/* 동기화 상태 */}
      <div className="w-[15%] shrink-0 pr-10">
        <Badge variant={status} size="sm">
          {statusText}
        </Badge>
      </div>

      {/* 예산 소진 현황 */}
      <div className="w-[30%] shrink-0">
        <ProgressBar value={progress} />
      </div>
    </li>
  );
}
