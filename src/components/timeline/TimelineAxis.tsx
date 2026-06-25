import { twMerge } from "tailwind-merge";

import type { ITimelineGridColumn } from "@/types/timeline/ui";
import {
  TIMELINE_AXIS_HEIGHT,
  TIMELINE_AXIS_Z_INDEX,
  TIMELINE_COL_WIDTH,
} from "@/constants/timeline/layout";

interface ITimelineAxisProps {
  columns: ITimelineGridColumn[];
  colWidth?: number;
  className?: string;
}

export default function TimelineAxis({
  columns,
  colWidth = TIMELINE_COL_WIDTH,
  className,
}: ITimelineAxisProps) {
  return (
    <div
      className={twMerge(
        "relative flex shrink-0 border-b border-surface-400/80 bg-surface-100",
        className,
      )}
      style={{ height: TIMELINE_AXIS_HEIGHT, zIndex: TIMELINE_AXIS_Z_INDEX }}
    >
      {columns.map((column, index) => (
        <div
          key={column.isoDate ?? `${column.day}-${column.date}-${index}`}
          className="flex flex-col items-center justify-center gap-0.5"
          style={{ width: colWidth }}
        >
          <span
            className={twMerge(
              "font-caption text-text-muted",
              column.isWeekend && !column.isToday && "text-text-placeholder",
              column.isToday && "text-primary-400",
            )}
          >
            {column.day}
          </span>
          {column.isToday ? (
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-400 font-body2 text-surface-100">
              {column.date}
            </span>
          ) : (
            <span className="font-body2 text-text-title">{column.date}</span>
          )}
        </div>
      ))}
    </div>
  );
}
