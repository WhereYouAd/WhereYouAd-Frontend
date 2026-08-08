import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

import type { TPlatform, TStatus } from "@/types/ads/campaign";

import ProgressBar from "../common/progressbar/ProgressBar";

import GoogleLogo from "@/assets/logo/social-logo/circle/google-circle.svg?react";
import MetaLogo from "@/assets/logo/social-logo/circle/meta-circle.svg?react";
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

/** 헤더·행·스켈레톤 플랫폼 열 — 모바일에서 로고 최대 3개 폭 예약 */
export const CAMPAIGN_PLATFORM_COL_CLASS =
  "mr-24 w-28 shrink-0 tablet:mr-20 tablet:w-24 mobile:mr-2 mobile:w-16";

/** 헤더·행·스켈레톤 예산 열 */
export const CAMPAIGN_BUDGET_COL_CLASS =
  "w-[28%] shrink-0 tablet:w-[26%] mobile:w-[30%] mobile:max-w-28";

const LogoMap: Record<TPlatform, ReactNode> = {
  meta: (
    <MetaLogo className="h-7 w-7 shrink-0 text-text-title tablet:h-6 tablet:w-6 mobile:h-5 mobile:w-5" />
  ),
  google: (
    <GoogleLogo className="h-7 w-7 shrink-0 tablet:h-6 tablet:w-6 mobile:h-5 mobile:w-5" />
  ),
  naver: (
    <NaverLogo className="h-7 w-7 shrink-0 tablet:h-6 tablet:w-6 mobile:h-5 mobile:w-5" />
  ),
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
        "flex list-none cursor-pointer items-center border-b border-surface-400/50 px-6 py-5 transition-colors last:border-b-0 tablet:px-5 tablet:py-4 mobile:px-3 mobile:py-3",
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
        className="flex w-11 shrink-0 items-center justify-center tablet:w-10 mobile:w-8"
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

      <div className="min-w-0 flex-1 pr-5 tablet:pr-4 mobile:pr-2">
        <div
          className={twMerge(
            "truncate font-body1-rsp",
            isPaused ? "text-text-muted" : "text-text-title",
          )}
        >
          {name}
        </div>
      </div>

      <div
        className={twMerge(
          CAMPAIGN_PLATFORM_COL_CLASS,
          "flex items-center justify-start",
        )}
      >
        {providers && providers.length > 0 ? (
          <div className="flex items-center justify-start gap-1 mobile:gap-0.5">
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
        className={twMerge(CAMPAIGN_BUDGET_COL_CLASS, isPaused && "opacity-80")}
      >
        <ProgressBar value={budgetUsageRate} />
      </div>
    </li>
  );
}
