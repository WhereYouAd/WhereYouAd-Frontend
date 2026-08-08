import { useRef } from "react";

import {
  LANDING_TIMELINE_BARS,
  LANDING_TIMELINE_COLUMNS,
} from "@/constants/landing/timeline";
import { TIMELINE_COL_WIDTH } from "@/constants/timeline/layout";

import { useContainerWidth } from "@/hooks/timeline/useContainerWidth";

import TimelineAxis from "@/components/timeline/TimelineAxis";
import TimelineBar from "@/components/timeline/TimelineBar";
import TimelineGrid from "@/components/timeline/TimelineGrid";

import FilterIcon from "@/assets/icon/timeline/filter.svg?react";
import SortIcon from "@/assets/icon/timeline/sort.svg?react";

export default function GuideTimeline() {
  //랜딩 가이드 column 폭이 좁아서 실제 타임라인보다는 작게
  const scrollRef = useRef<HTMLDivElement>(null);
  const containerWidth = useContainerWidth(scrollRef);

  const columnCount = LANDING_TIMELINE_COLUMNS.length;
  const colWidth =
    columnCount > 0 && containerWidth > 0
      ? Math.max(TIMELINE_COL_WIDTH, containerWidth / columnCount)
      : TIMELINE_COL_WIDTH;
  const totalWidth = LANDING_TIMELINE_COLUMNS.length * colWidth;
  const rowCount = Math.max(...LANDING_TIMELINE_BARS.map((bar) => bar.row), 1);

  return (
    <div className="landing-guide-timeline flex h-75 w-full flex-col rounded-2xl bg-surface-100 md:h-85">
      <style>
        {`
        .landing-guide-timeline .custom-scrollbar::-webkit-scrollbar {
          height: 0px;
        }
        .landing-guide-timeline .custom-scrollbar {
          scrollbar-width: none;
        }
        .landing-guide-timeline .custom-scrollbar::-webkit-scrollbar-thumb {
          background: transparent;
        }
      `}
      </style>
      <div className="z-20 flex flex-none items-center justify-between border-b border-surface-400/80 bg-surface-100 px-5 py-3">
        <div
          aria-label="보기 모드(목업)"
          className="flex items-center rounded-lg border border-surface-400/70 bg-surface-100 p-0.5"
          role="group"
        >
          <span className="select-none rounded-md px-3 py-1.5 font-caption text-text-muted opacity-60">
            일
          </span>
          <span className="select-none rounded-md bg-surface-100 px-3 py-1.5 font-caption text-text-title shadow-Soft">
            주
          </span>
          <span className="select-none rounded-md px-3 py-1.5 font-caption text-text-muted opacity-60">
            월
          </span>
        </div>
        <div
          aria-label="정렬/필터(목업)"
          className="flex select-none items-center gap-5 font-caption text-text-auth-sub"
          role="group"
        >
          <span className="flex items-center gap-1.5 opacity-70">
            <SortIcon className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Sort</span>
          </span>
          <span className="flex items-center gap-1.5 opacity-70">
            <FilterIcon className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Filter</span>
          </span>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="custom-scrollbar relative flex-1 overflow-x-auto overflow-y-hidden bg-surface-100"
      >
        <div className="flex h-full flex-col" style={{ width: totalWidth }}>
          <TimelineAxis
            columns={LANDING_TIMELINE_COLUMNS}
            colWidth={colWidth}
          />
          <TimelineGrid
            columns={LANDING_TIMELINE_COLUMNS}
            rowCount={rowCount}
            colWidth={colWidth}
          >
            {LANDING_TIMELINE_BARS.map((bar) => (
              <TimelineBar key={bar.id} bar={bar} colWidth={colWidth} />
            ))}
          </TimelineGrid>
        </div>
      </div>
    </div>
  );
}
