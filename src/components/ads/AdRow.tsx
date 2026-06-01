import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

import type { TPlatform, TStatus } from "@/types/ads/campaign";

import Badge from "../common/badge/Badge";

import ChevronIcon from "@/assets/icon/chevron/chevron-up.svg?react";
import GoogleLogo from "@/assets/logo/social-logo/circle/google-circle.svg?react";
import MetaLogo from "@/assets/logo/social-logo/circle/meta-circle.svg?react";
import NaverLogo from "@/assets/logo/social-logo/circle/naver-circle.svg?react";

/** 체크박스 | 광고 명 | 상태 | 플랫폼 | 펼침 — AdListTable과 동일 그리드 (CampaignTable 패딩과 통일) */
const adListTableGridCols =
  "grid w-full min-w-0 grid-cols-[2.75rem_minmax(0,1fr)_auto_auto_2.5rem] items-center gap-x-3";

export const adListTableHeaderGridClass = `${adListTableGridCols} px-6 py-4 tablet:px-5 tablet:py-3.5`;

export const adListTableRowGridClass = `${adListTableGridCols} px-6 py-5 tablet:px-5 tablet:py-4`;

/** @deprecated 행 패딩과 동일. 명시적으로 `adListTableRowGridClass` 사용 권장 */
export const adListTableGridClass = adListTableRowGridClass;

interface IAdRowProps {
  name: string;
  adStatus: TStatus;
  runStatus: "running" | "stopped";
  runStatusText: string;
  platform: TPlatform;
  isOpen: boolean;
  isSelected: boolean;
  selectable: boolean;
  onToggleSelect: () => void;
  onToggle: () => void;
}

const LogoMap: Record<TPlatform, ReactNode> = {
  meta: <MetaLogo className="h-7 w-7 shrink-0 text-text-title" />,
  google: <GoogleLogo className="h-7 w-7 shrink-0" />,
  naver: <NaverLogo className="h-7 w-7 shrink-0" />,
};

export default function AdRow({
  name,
  adStatus,
  runStatus,
  runStatusText,
  platform,
  isOpen,
  isSelected,
  selectable,
  onToggleSelect,
  onToggle,
}: IAdRowProps) {
  const isPaused = adStatus === "PAUSED";

  return (
    <div
      className={twMerge(
        "border-b border-surface-400/50 last:border-b-0",
        isOpen && "border-b-0 bg-surface-300",
        isSelected && !isOpen && "bg-primary-100/35",
        isPaused && !isSelected && !isOpen && "bg-surface-200/40",
      )}
    >
      <div className={adListTableRowGridClass}>
        <div
          className="flex items-center justify-center"
          role="presentation"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <input
            type="checkbox"
            className="checkbox"
            checked={isSelected}
            disabled={!selectable}
            onChange={onToggleSelect}
            aria-label={`${name} 선택`}
          />
        </div>

        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          className={twMerge(
            "min-w-0 cursor-pointer truncate text-left font-body1 outline-none transition-colors hover:text-primary-500",
            isPaused ? "text-text-muted" : "text-text-title",
            isOpen && "text-primary-500",
          )}
        >
          {name}
        </button>

        <div className="flex min-w-0 justify-start justify-self-start items-center pr-8 tablet:pr-6">
          <Badge variant={runStatus === "running" ? "infoBlue" : "surface"}>
            {runStatusText}
          </Badge>
        </div>

        <div className="flex min-w-11 items-center justify-start justify-self-start">
          <span className="flex shrink-0" title={platform}>
            {LogoMap[platform] ?? (
              <span className="font-caption text-text-muted">?</span>
            )}
          </span>
        </div>

        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={onToggle}
            aria-label={isOpen ? `${name} 상세 접기` : `${name} 상세 펼치기`}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-text-auth-sub transition-colors hover:bg-surface-200/80 hover:text-text-title"
          >
            <ChevronIcon
              className={twMerge(
                "h-4 w-4 transition-transform duration-200",
                isOpen ? "rotate-0 text-primary-400" : "rotate-180",
              )}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
