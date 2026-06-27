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
    <div
      className={twMerge(
        "relative flex min-h-0 flex-1 flex-col bg-surface-200",
        className,
      )}
    >
      <div
        className="relative min-h-0 flex-1"
        style={{ minHeight: `max(${bodyHeight}px, 100%)` }}
      >
        {columns.map((column, i) => (
          <div
            key={`col-${column.isoDate ?? i}`}
            className={twMerge(
              "absolute inset-y-0 border-r border-surface-400/40",
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
