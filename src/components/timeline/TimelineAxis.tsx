import { twMerge } from "tailwind-merge";

import type { ITimelineGridColumn } from "@/types/timeline/ui";
import { TIMELINE_COL_WIDTH } from "@/constants/timeline/layout";

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
        "relative z-10 flex h-7 items-center border-b border-surface-400/80 bg-surface-100",
        className,
      )}
    >
      {columns.map((column, index) => (
        <div
          key={column.isoDate ?? `${column.day}-${column.date}-${index}`}
          className="flex justify-center font-caption text-text-placeholder"
          style={{ width: colWidth }}
        >
          <span className="relative flex items-center gap-1">
            {column.day} <span className="text-text-title">{column.date}</span>
          </span>
        </div>
      ))}
    </div>
  );
}
