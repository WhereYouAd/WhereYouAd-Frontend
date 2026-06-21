import { twMerge } from "tailwind-merge";

import type { ITimelineCampaignBar } from "@/types/timeline/ui";
import {
  TIMELINE_COL_WIDTH,
  TIMELINE_ROW_HEIGHT,
  TIMELINE_ROW_OFFSET,
} from "@/constants/timeline/layout";

import KebabIcon from "@/assets/icon/timeline/kebab.svg?react";

interface ITimelineBarProps {
  bar: ITimelineCampaignBar;
  colWidth?: number;
  rowHeight?: number;
  rowOffset?: number;
  className?: string;
  onMenuClick?: (bar: ITimelineCampaignBar) => void; //선택, 추후 이슈로 다룰 예정
}

export default function ({
  bar,
  colWidth = TIMELINE_COL_WIDTH,
  rowHeight = TIMELINE_ROW_HEIGHT,
  rowOffset = TIMELINE_ROW_OFFSET,
  className,
  onMenuClick,
}: ITimelineBarProps) {
  const left = (bar.colStart - 1) * colWidth;
  const width = (bar.colEnd - bar.colStart) * colWidth;
  const top = rowOffset + (bar.row - 1) * rowHeight;
  return (
    <div
      className={twMerge(
        "absolute z-20 flex h-13 cursor-pointer items-center gap-2.5 rounded-xl border border-surface-400/80 bg-surface-100 px-3 shadow-Soft transition-transform hover:z-30 hover:scale-[1.01]",
        className,
      )}
      style={{ left, top, width }}
    >
      <div
        className={twMerge("h-7 w-1 shrink-0 rounded-full", bar.colorClass)}
      />
      <div className="flex min-w-0 flex-col pr-2">
        <div className="truncate font-body2 text-text-title">{bar.title}</div>
        <div className="mt-0.5 font-caption text-text-muted">
          {bar.subtitle}
        </div>
      </div>
      <div className="ml-auto flex shrink-0 items-center">
        <button
          type="button"
          aria-label="캠페인 메뉴"
          className="flex h-5 w-5 items-center justify-center rounded-full text-text-placeholder transition-colors hover:bg-surface-500/5"
          onClick={() => onMenuClick?.(bar)}
        >
          <KebabIcon className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
