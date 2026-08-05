import { useState } from "react";
import { twMerge } from "tailwind-merge";

import { PLATFORM_MAP, PROVIDER_TYPES } from "@/types/dashboard/provider";
import type { ITimelineCampaignBar } from "@/types/timeline/ui";
import { PLATFORM_CIRCLE_LOGO_MAP } from "@/constants/dashboard/platformLogos";
import {
  TIMELINE_BAR_ELEVATED_Z_INDEX,
  TIMELINE_BAR_HEIGHT,
  TIMELINE_BAR_Z_INDEX,
  TIMELINE_COL_WIDTH,
  TIMELINE_ROW_HEIGHT,
  TIMELINE_ROW_OFFSET,
} from "@/constants/timeline/layout";
import { resolveTimelinePerformanceStatusStyle } from "@/constants/timeline/statusStyle";

import { DropdownMenu } from "../common/dropdownmenu/DropdownMenu";

import KebabIcon from "@/assets/icon/timeline/kebab.svg?react";

interface ITimelineBarProps {
  bar: ITimelineCampaignBar;
  colWidth?: number;
  rowHeight?: number;
  rowOffset?: number;
  isSelected?: boolean;
  className?: string;
  onBarClick?: (bar: ITimelineCampaignBar) => void;
  onEdit?: (bar: ITimelineCampaignBar) => void;
  onDelete?: (bar: ITimelineCampaignBar) => void;
}

export default function TimelineBar({
  bar,
  colWidth = TIMELINE_COL_WIDTH,
  rowHeight = TIMELINE_ROW_HEIGHT,
  rowOffset = TIMELINE_ROW_OFFSET,
  isSelected = false,
  className,
  onBarClick,
  onEdit,
  onDelete,
}: ITimelineBarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const status = resolveTimelinePerformanceStatusStyle(bar.performanceStatus);
  const left = (bar.colStart - 1) * colWidth;
  const columnSpan = Math.max(bar.colEnd - bar.colStart, 1);
  const width = columnSpan * colWidth;
  const top =
    rowOffset +
    (bar.row - 1) * rowHeight +
    (rowHeight - TIMELINE_BAR_HEIGHT) / 2;

  const providers = PROVIDER_TYPES.filter((provider) =>
    bar.providers?.includes(provider),
  );

  const showActions = onEdit != null || onDelete != null;
  const isElevated = (showActions && isMenuOpen) || isSelected;

  return (
    <div
      role="button"
      tabIndex={0}
      className={twMerge(
        "group/bar absolute flex cursor-pointer items-start gap-2 rounded-xl px-3 py-2.5 transition-shadow hover:shadow-Soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400/40",
        status.barBg,
        isSelected &&
          twMerge("ring-2 ring-offset-1 ring-offset-surface-200", status.ring),
        className,
      )}
      onClick={() => onBarClick?.(bar)}
      onKeyDown={(event) => {
        if (event.currentTarget !== event.target) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onBarClick?.(bar);
        }
      }}
      style={{
        left,
        top,
        width,
        height: TIMELINE_BAR_HEIGHT,
        zIndex: isElevated
          ? TIMELINE_BAR_ELEVATED_Z_INDEX
          : TIMELINE_BAR_Z_INDEX,
      }}
    >
      <div
        className={twMerge(
          "mt-0.5 h-14 w-1 shrink-0 rounded-full",
          status.accent,
        )}
      />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex min-w-0 items-center gap-1.5">
          {providers.length > 0 ? (
            <div
              className="flex shrink-0 items-center -space-x-1"
              aria-label={providers.map((p) => PLATFORM_MAP[p]).join(", ")}
            >
              {providers.map((provider) => {
                const Logo = PLATFORM_CIRCLE_LOGO_MAP[provider];
                return (
                  <Logo
                    key={provider}
                    className="h-4 w-4 rounded-full ring-2 ring-surface-100"
                    aria-hidden
                  />
                );
              })}
            </div>
          ) : null}
          <span className="truncate font-body2 text-text-title">
            {bar.title}
          </span>
        </div>
        <span className="truncate font-caption text-text-muted">
          {bar.subtitle}
        </span>
        <span className="flex items-center gap-1 font-caption text-text-body">
          <span className={twMerge("h-1.5 w-1.5 rounded-full", status.dot)} />
          {status.label}
        </span>
      </div>
      {showActions ? (
        <div
          className={twMerge(
            "ml-auto flex shrink-0 self-center items-center opacity-0 transition-opacity",
            "group-hover/bar:opacity-100 group-focus-within/bar:opacity-100",
            isSelected && "opacity-100",
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <DropdownMenu
            aria-label="캠페인 메뉴"
            placement="auto"
            onOpenChange={setIsMenuOpen}
            menuClassName="w-40 py-2 [&_[role=menuitem]]:px-4 [&_[role=menuitem]]:py-3"
            trigger={
              <button
                type="button"
                aria-label="캠페인 메뉴"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-text-placeholder transition-colors hover:bg-surface-500/10"
              >
                <KebabIcon className="h-4 w-4" />
              </button>
            }
            items={[
              ...(onEdit
                ? [{ label: "수정하기", onClick: () => onEdit(bar) }]
                : []),
              ...(onDelete
                ? [
                    {
                      label: "삭제하기",
                      danger: true,
                      labelClassName: "text-info-red",
                      onClick: () => onDelete(bar),
                    },
                  ]
                : []),
            ]}
          />
        </div>
      ) : null}
    </div>
  );
}
