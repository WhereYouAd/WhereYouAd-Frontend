import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

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
  isSelected: boolean;
  onToggleSelect: () => void;
  onClick?: () => void;
}

const LogoMap: Record<TPlatform, ReactNode> = {
  kakao: <KakaoLogo className="h-full w-full" />,
  google: <GoogleLogo className="h-full w-full" />,
  naver: <NaverLogo className="h-full w-full" />,
};

export default function CampaignRow({
  name,
  providers,
  status,
  budgetUsageRate,
  isSelected,
  onToggleSelect,
  onClick,
}: ICampaignRowProps) {
  const isPaused = status === "PAUSED";

  return (
    <li
      className={twMerge(
        "flex list-none cursor-pointer items-center border-b border-surface-400/50 px-4 py-6 transition-colors last:border-b-0 tablet:px-3 tablet:py-5",
        isSelected
          ? "bg-primary-100/35 hover:bg-primary-100/45"
          : "bg-surface-100 hover:bg-surface-200/50",
        isPaused && !isSelected && "bg-surface-200/40",
      )}
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
      <div
        className="flex w-11 shrink-0 items-center justify-center tablet:w-10"
        role="presentation"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <input
          type="checkbox"
          className="checkbox"
          checked={isSelected}
          onChange={onToggleSelect}
          aria-label={`${name} 선택`}
        />
      </div>

      <div className="min-w-0 flex-1 pr-4 tablet:pr-3">
        <div
          className={twMerge(
            "truncate font-body1",
            isPaused ? "text-text-muted" : "text-text-title",
          )}
        >
          {name}
        </div>
      </div>

      <div className="mr-24 flex w-28 shrink-0 items-center justify-start tablet:mr-20 tablet:w-24">
        {providers && providers.length > 0 ? (
          <div className="flex items-center justify-start gap-1">
            {providers.map((p, idx) => (
              <div
                key={idx}
                className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full shadow-sm tablet:h-6 tablet:w-6"
              >
                {LogoMap[p.toLowerCase() as TPlatform]}
              </div>
            ))}
          </div>
        ) : (
          <div className="font-caption text-text-placeholder">미연결</div>
        )}
      </div>

      <div
        className={twMerge(
          "w-[28%] shrink-0 tablet:w-[26%]",
          isPaused && "opacity-80",
        )}
      >
        <ProgressBar value={budgetUsageRate} />
      </div>
    </li>
  );
}
