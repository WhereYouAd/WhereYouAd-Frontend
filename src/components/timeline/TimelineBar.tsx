import { twMerge } from "tailwind-merge";

import type { ITimelineCampaignBar } from "@/types/timeline/ui";
import {
  TIMELINE_BAR_HEIGHT,
  TIMELINE_COL_WIDTH,
  TIMELINE_ROW_HEIGHT,
  TIMELINE_ROW_OFFSET,
} from "@/constants/timeline/layout";
import { TIMELINE_PERFORMANCE_STATUS_STYLE } from "@/constants/timeline/statusStyle";

import KebabIcon from "@/assets/icon/timeline/kebab.svg?react";

interface ITimelineBarProps {
  bar: ITimelineCampaignBar;
  colWidth?: number;
  rowHeight?: number;
  rowOffset?: number;
  className?: string;
  onMenuClick?: (bar: ITimelineCampaignBar) => void; //선택, 추후 이슈로 다룰 예정
}

export default function TimelineBar({
  bar,
  colWidth = TIMELINE_COL_WIDTH,
  rowHeight = TIMELINE_ROW_HEIGHT,
  rowOffset = TIMELINE_ROW_OFFSET,
  className,
  onMenuClick,
}: ITimelineBarProps) {
  const status = TIMELINE_PERFORMANCE_STATUS_STYLE[bar.performanceStatus];
  const left = (bar.colStart - 1) * colWidth;
  const columnSpan = Math.max(bar.colEnd - bar.colStart, 1);
  const width = columnSpan * colWidth;
  const top =
    rowOffset +
    (bar.row - 1) * rowHeight +
    (rowHeight - TIMELINE_BAR_HEIGHT) / 2;
  return (
    /*카드 클릭하면 성과요약 패널 나오도록 핸들러 구현 예정 */
    <div
      className={twMerge(
        "absolute z-20 flex cursor-pointer items-start gap-2.5 rounded-xl px-3 py-2.5 transition-shadow hover:z-30 hover:shadow-Soft",
        status.barBg,
        className,
      )}
      style={{ left, top, width, height: TIMELINE_BAR_HEIGHT }}
    >
      <div
        className={twMerge(
          "mt-0.5 h-14 w-1 shrink-0 rounded-full",
          status.accent,
        )}
      />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate font-body2 text-text-title">{bar.title}</span>
        <span className="truncate font-caption text-text-muted">
          {bar.subtitle}
        </span>
        <span className="flex items-center gap-1 font-caption text-text-body">
          <span className={twMerge("h-1.5 w-1.5 rounded-full", status.dot)} />
          {status.label}
        </span>
      </div>
      <div className="ml-auto flex shrink-0 self-center items-center">
        <button
          type="button"
          aria-label="캠페인 메뉴"
          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-text-placeholder transition-colors hover:bg-surface-500/5"
          onClick={() => onMenuClick?.(bar)}
        >
          <KebabIcon className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
