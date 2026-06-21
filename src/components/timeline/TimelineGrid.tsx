import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

import type { ITimelineGridColumn } from "@/types/timeline/ui";
import {
  TIMELINE_COL_WIDTH,
  TIMELINE_ROW_HEIGHT,
  TIMELINE_ROW_OFFSET,
} from "@/constants/timeline/layout";

interface ITimelineGridProps {
  columns: ITimelineGridColumn[];
  rowCount: number;
  colWidth?: number;
  rowHeight?: number;
  rowOffset?: number;
  className?: string;
  children?: ReactNode; //TimelineBar들
}

export default function TimelineGrid({
  columns,
  rowCount,
  colWidth = TIMELINE_COL_WIDTH,
  rowHeight = TIMELINE_ROW_HEIGHT,
  rowOffset = TIMELINE_ROW_OFFSET,
  className,
  children,
}: ITimelineGridProps) {
  const bodyHeight = rowOffset + rowCount * rowHeight;

  return (
    <div className={twMerge("relative flex-1 bg-surface-200", className)}>
      <div className="relative h-full" style={{ minHeight: bodyHeight }}>
        {columns.map((column, i) => (
          <div
            key={`col-${column.isoDate ?? i}`}
            className={twMerge(
              "absolute top-0 bottom-0 border-r border-surface-400/80",
              column.isToday && "bg-primary-400/8",
            )}
            style={{ left: i * colWidth, width: colWidth }}
          />
        ))}
        {children}
      </div>
    </div>
  );
}
