import { twMerge } from "tailwind-merge";

import { PLATFORM_MAP, PROVIDER_TYPES } from "@/types/dashboard/provider";
import type { ITimelineCampaignBar } from "@/types/timeline/ui";
import { PLATFORM_CIRCLE_LOGO_MAP } from "@/constants/dashboard/platformLogos";
import {
  TIMELINE_BAR_HEIGHT,
  TIMELINE_COL_WIDTH,
  TIMELINE_ROW_HEIGHT,
  TIMELINE_ROW_OFFSET,
} from "@/constants/timeline/layout";
import { TIMELINE_PERFORMANCE_STATUS_STYLE } from "@/constants/timeline/statusStyle";

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
  const status = TIMELINE_PERFORMANCE_STATUS_STYLE[bar.performanceStatus];
  const left = (bar.colStart - 1) * colWidth;
  const width = (bar.colEnd - bar.colStart) * colWidth;
  const top =
    rowOffset +
    (bar.row - 1) * rowHeight +
    (rowHeight - TIMELINE_BAR_HEIGHT) / 2;

  const providers = PROVIDER_TYPES.filter((provider) =>
    bar.providers?.includes(provider),
  );

  return (
    <div
      className={twMerge(
        "group/bar absolute z-20 flex cursor-pointer items-start gap-2 rounded-xl px-3 py-2.5 transition-shadow hover:z-30 hover:shadow-Soft",
        status.barBg,
        isSelected &&
          twMerge(
            "z-30 ring-2 ring-offset-1 ring-offset-surface-200",
            status.ring,
          ),
        className,
      )}
      onClick={() => onBarClick?.(bar)}
      style={{ left, top, width, height: TIMELINE_BAR_HEIGHT }}
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
            { label: "수정하기", onClick: () => onEdit?.(bar) },
            {
              label: "삭제하기",
              danger: true,
              labelClassName: "text-info-red",
              onClick: () => onDelete?.(bar),
            },
          ]}
        />
      </div>
    </div>
  );
}
