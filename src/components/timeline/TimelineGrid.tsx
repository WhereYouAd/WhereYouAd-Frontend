import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

import {
  TIMELINE_COL_WIDTH,
  TIMELINE_ROW_HEIGHT,
  TIMELINE_ROW_OFFSET,
} from "@/constants/timeline/layout";

interface ITimelineGridProps {
  columnCount: number;
  colWidth?: number;
  rowCount: number;
  rowHeight?: number;
  rowOffset?: number;
  className?: string;
  children?: ReactNode; //TimelineBar들
}

export default function TimelineGrid({
  columnCount,
  colWidth = TIMELINE_COL_WIDTH,
  rowCount,
  rowHeight = TIMELINE_ROW_HEIGHT,
  rowOffset = TIMELINE_ROW_OFFSET,
  className,
  children,
}: ITimelineGridProps) {
  const bodyHeight = rowOffset + rowCount * rowHeight;
  return (
    <div className={twMerge("relative flex-1 bg-surface-100", className)}>
      <div className="relative" style={{ minHeight: bodyHeight }}>
        {Array.from({ length: columnCount }).map((_, i) => (
          <div
            key={i}
            className="absolute top-0 bottom-0 border-r border-surface-400/80"
            style={{ left: i * colWidth, width: colWidth }}
          />
        ))}
        {children}
      </div>
    </div>
  );
}
