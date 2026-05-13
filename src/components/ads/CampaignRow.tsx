import type { ReactNode } from "react";

import type { TPlatform, TStatus } from "@/types/ads/campaign";

import ProgressBar from "../common/progressbar/ProgressBar";

import GoogleLogo from "@/assets/logo/social-logo/circle/google-circle.svg?react";
import KakaoLogo from "@/assets/logo/social-logo/circle/kakao-circle.svg?react";
import NaverLogo from "@/assets/logo/social-logo/circle/naver-circle.svg?react";

interface ICampaignRowProps {
  projectId: number;
  name: string;
  providers: TPlatform[];
  status: TStatus;
  budgetUsageRate: number;
  onClick?: () => void;
}

const LogoMap: Record<TPlatform, ReactNode> = {
  kakao: <KakaoLogo className="w-full h-full" />,
  google: <GoogleLogo className="w-full h-full" />,
  naver: <NaverLogo className="w-full h-full" />,
};

export default function CampaignRow({
  name,
  providers,
  status,
  budgetUsageRate,
  onClick,
}: ICampaignRowProps) {
  const isPaused = status == "PAUSED";
  return (
    <li
      className={`flex items-center px-7 py-5 border-b border-bg-disabled hover:bg-bg-surface hover:cursor-pointer transition-colors list-none ${
        isPaused ? "bg-bg-surface" : "bg-white"
      }
       `}
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
      <div className="flex w-[25%] tablet:w-[28%] shrink-0">
        {providers && providers.length > 0 ? (
          providers.map((p, idx) => (
            <div
              key={idx}
              className="flex h-8 w-8 tablet:h-6 tablet:w-6 mr-3 tablet:mr-1 items-center justify-center rounded-full shadow-sm overflow-hidden shrink-0"
            >
              {LogoMap[p.toLowerCase() as TPlatform]}
            </div>
          ))
        ) : (
          <div className="text-text-placeholder font-body2">미연결</div>
        )}
      </div>

      {/* 캠페인 명 */}
      <div className="w-[40%] tablet:w-[34%] min-w-0 pr-10 tablet:pr-3 shrink-0">
        <div
          className={`font-body1 truncate ${isPaused ? "text-text-sub" : "text-text-main"}`}
        >
          {name}
        </div>
      </div>

      {/* 동기화 상태 */}
      {/* <div className="w-[15%] tablet:w-[18%] shrink-0 pr-10 tablet:pr-2">
        <Badge variant={status}>
          {statusText}
        </Badge>
      </div> */}

      {/* 예산 소진 현황 */}
      <div
        className={`w-[35%] tablet:w-[38%] shrink-0 ${isPaused ? "opacity-80" : ""}`}
      >
        <ProgressBar value={budgetUsageRate} />
      </div>
    </li>
  );
}
