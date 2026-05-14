import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

import type { TPlatform, TStatus } from "@/types/ads/campaign";

import ProgressBar from "../common/progressbar/ProgressBar";

import GoogleLogo from "@/assets/logo/social-logo/circle/google-circle.svg?react";
import NaverLogo from "@/assets/logo/social-logo/circle/naver-circle.svg?react";
import KakaoLogo from "@/assets/logo/social-logo/plain/kakao.svg?react";

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
  kakao: <KakaoLogo className="h-7 w-7 shrink-0 tablet:h-6 tablet:w-6" />,
  google: <GoogleLogo className="h-7 w-7 shrink-0 tablet:h-6 tablet:w-6" />,
  naver: <NaverLogo className="h-7 w-7 shrink-0 tablet:h-6 tablet:w-6" />,
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
        "flex list-none cursor-pointer items-center border-b border-surface-400/50 px-6 py-5 transition-colors last:border-b-0 tablet:px-5 tablet:py-4",
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

      <div className="min-w-0 flex-1 pr-5 tablet:pr-4">
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
              <span key={idx} className="flex shrink-0">
                {LogoMap[p.toLowerCase() as TPlatform] ?? (
                  <span className="font-caption text-text-muted">?</span>
                )}
              </span>
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
