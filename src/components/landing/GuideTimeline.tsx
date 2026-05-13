import {
  LANDING_TIMELINE_CARDS,
  LANDING_TIMELINE_COLUMNS,
} from "@/constants/landing/timeline";

import ChevronLeftIcon from "@/assets/icon/timeline/chevron-left.svg?react";
import ChevronRightIcon from "@/assets/icon/timeline/chevron-right.svg?react";
import FilterIcon from "@/assets/icon/timeline/filter.svg?react";
import KebabIcon from "@/assets/icon/timeline/kebab.svg?react";
import SortIcon from "@/assets/icon/timeline/sort.svg?react";

export default function GuideTimeline() {
  const colWidth = 55;
  const rowHeight = 92;
  const rowOffset = 24;
  const totalWidth = LANDING_TIMELINE_COLUMNS.length * colWidth;

  return (
    <div className="landing-guide-timeline w-full h-[360px] md:h-[420px] overflow-hidden flex flex-col bg-surface-100 font-sans">
      <style>{`
        .landing-guide-timeline .custom-scrollbar::-webkit-scrollbar {
          height: 0px;
        }
        .landing-guide-timeline .custom-scrollbar {
          scrollbar-width: none;
        }
        .landing-guide-timeline .custom-scrollbar::-webkit-scrollbar-thumb {
          background: transparent;
        }
      `}</style>
      {/* Top Navigation */}
      <div className="flex-none flex items-center justify-between px-5 py-3 border-b border-surface-400/80 bg-surface-100 z-20">
        <div
          aria-label="보기 모드(목업)"
          className="flex items-center bg-surface-100 p-0.5 rounded-[8px] border border-surface-400/70"
          role="group"
        >
          <span className="px-3 py-1.5 text-[12px] font-semibold text-text-muted rounded-md select-none opacity-60">
            Day
          </span>
          <span className="px-3 py-1.5 text-[12px] font-semibold text-text-title bg-surface-100 shadow-landing-pill rounded-[6px] select-none">
            Week
          </span>
          <span className="px-3 py-1.5 text-[12px] font-semibold text-text-muted rounded-md select-none opacity-60">
            Month
          </span>
        </div>

        <div className="flex items-center gap-4 text-[13px] font-bold text-text-title">
          <button
            type="button"
            aria-label="이전 기간"
            className="text-text-placeholder hover:text-text-muted transition-colors"
          >
            <ChevronLeftIcon className="h-3.5 w-3.5" />
          </button>
          <span>27 Dec - 4 Jan</span>
          <button
            type="button"
            aria-label="다음 기간"
            className="text-text-placeholder hover:text-text-muted transition-colors"
          >
            <ChevronRightIcon className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-5 text-[12px] font-semibold text-text-auth-sub">
          <div
            aria-label="정렬/필터(목업)"
            className="flex items-center gap-5 text-[12px] font-semibold text-text-auth-sub select-none"
            role="group"
          >
            <span className="flex items-center gap-1.5 opacity-70">
              <SortIcon className="h-3.5 w-3.5" />
              <span>Sort</span>
            </span>
            <span className="flex items-center gap-1.5 opacity-70">
              <FilterIcon className="h-3.5 w-3.5" />
              <span>Filter</span>
            </span>
          </div>
        </div>
      </div>

      {/* Chart Area */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden custom-scrollbar relative pb-4 bg-surface-100">
        <div
          className="h-full flex flex-col relative"
          style={{ width: totalWidth }}
        >
          {/* Header (Dates) */}
          <div className="h-[28px] flex items-center border-b border-surface-400/80 relative bg-surface-100 z-10">
            {LANDING_TIMELINE_COLUMNS.map((c, i) => (
              <div
                key={i}
                className="w-[55px] flex justify-center text-[11px] font-semibold text-text-placeholder"
              >
                <span className="relative flex items-center gap-1">
                  {c.day} <span className="text-text-title">{c.date}</span>
                </span>
              </div>
            ))}
          </div>

          {/* Timeline Body Grid */}
          <div className="relative flex-1">
            {/* Columns Background */}
            {LANDING_TIMELINE_COLUMNS.map((_, i) => (
              <div
                key={i}
                className="absolute top-0 bottom-0 border-r border-surface-400/80"
                style={{ left: `${i * 55}px`, width: "55px" }}
              />
            ))}

            {/* Today Line removed for cleaner mock */}

            {/* Cards */}
            {LANDING_TIMELINE_CARDS.map((card) => {
              const x = (card.colStart - 1) * colWidth;
              const width = (card.colEnd - card.colStart) * colWidth;
              const y = rowOffset + (card.row - 1) * rowHeight;

              return (
                <div
                  key={card.id}
                  className="absolute flex items-center px-3 gap-2.5 rounded-[12px] h-[52px] z-20 cursor-pointer border border-surface-400/80 bg-surface-100 shadow-landing-tooltip transition-transform hover:scale-[1.01] hover:z-30"
                  style={{ left: `${x}px`, top: `${y}px`, width: `${width}px` }}
                >
                  {/* Left Indicator */}
                  <div
                    className={`w-[4px] h-[30px] rounded-full shrink-0 ${card.colorClass}`}
                  />

                  {/* Text */}
                  <div className="flex flex-col min-w-0 pr-2">
                    <span className="text-[12px] font-bold truncate leading-tight tracking-tight text-text-title">
                      {card.title}
                    </span>
                    <span className="text-[10px] flex items-center gap-1.5 leading-tight mt-0.5 text-text-muted">
                      {card.subtitle}
                    </span>
                  </div>

                  {/* Menu */}
                  <div className="ml-auto flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      aria-label="캠페인 메뉴"
                      className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-surface-500/5 transition-colors text-text-placeholder"
                    >
                      <KebabIcon className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
