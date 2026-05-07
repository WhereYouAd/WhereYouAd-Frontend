import ChevronLeftIcon from "@/assets/icon/timeline/chevron-left.svg?react";
import ChevronRightIcon from "@/assets/icon/timeline/chevron-right.svg?react";
import FilterIcon from "@/assets/icon/timeline/filter.svg?react";
import KebabIcon from "@/assets/icon/timeline/kebab.svg?react";
import SortIcon from "@/assets/icon/timeline/sort.svg?react";

const columns = [
  { day: "M", date: 30, isWeekend: false },
  { day: "T", date: 31, isWeekend: false },
  { day: "W", date: 1, isWeekend: false },
  { day: "T", date: 2, isWeekend: false, isToday: true },
  { day: "F", date: 3, isWeekend: false },
  { day: "S", date: 4, isWeekend: true },
  { day: "S", date: 5, isWeekend: true },
  { day: "M", date: 6, isWeekend: false },
  { day: "T", date: 7, isWeekend: false },
  { day: "W", date: 8, isWeekend: false },
  { day: "T", date: 9, isWeekend: false },
  { day: "F", date: 10, isWeekend: false },
  { day: "S", date: 11, isWeekend: true },
  { day: "S", date: 12, isWeekend: true },
  { day: "M", date: 13, isWeekend: false },
  { day: "T", date: 14, isWeekend: false },
  { day: "W", date: 15, isWeekend: false },
];

const cards = [
  {
    id: 1,
    title: "봄 프로모션 캠페인",
    subtitle: "Google Ads · 전환",
    colStart: 3.2,
    colEnd: 9,
    row: 1,
    colorClass: "bg-status-blue",
  },
  {
    id: 2,
    title: "리타겟팅 캠페인",
    subtitle: "Meta · 트래픽",
    colStart: 8.9,
    colEnd: 15.3,
    row: 2,
    colorClass: "bg-logo-2",
  },
  {
    id: 3,
    title: "브랜드 검색 캠페인",
    subtitle: "Naver · 검색",
    colStart: 2.4,
    colEnd: 8,
    row: 3,
    colorClass: "bg-status-green",
  },
];

export default function GuideTimeline() {
  const colWidth = 55;
  const rowHeight = 92;
  const rowOffset = 24;
  const totalWidth = columns.length * colWidth;

  return (
    <div className="landing-guide-timeline w-full h-[360px] md:h-[420px] overflow-hidden flex flex-col bg-transparent font-sans">
      {/* Top Navigation */}
      <div className="flex-none flex items-center justify-between px-5 py-3 border-b border-chart-inactive/80 bg-white/80 backdrop-blur-md z-20">
        <div
          aria-label="보기 모드(목업)"
          className="flex items-center bg-brand-300/70 p-0.5 rounded-[8px] border border-chart-inactive/70"
          role="group"
        >
          <span className="px-3 py-1.5 text-[12px] font-semibold text-text-sub rounded-md select-none opacity-60">
            Day
          </span>
          <span className="px-3 py-1.5 text-[12px] font-semibold text-text-main bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)] rounded-[6px] select-none">
            Week
          </span>
          <span className="px-3 py-1.5 text-[12px] font-semibold text-text-sub rounded-md select-none opacity-60">
            Month
          </span>
        </div>

        <div className="flex items-center gap-4 text-[13px] font-bold text-text-main">
          <button
            type="button"
            aria-label="이전 기간"
            className="text-text-placeholder hover:text-text-sub transition-colors"
          >
            <ChevronLeftIcon className="h-3.5 w-3.5" />
          </button>
          <span>27 Dec - 4 Jan</span>
          <button
            type="button"
            aria-label="다음 기간"
            className="text-text-placeholder hover:text-text-sub transition-colors"
          >
            <ChevronRightIcon className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-5 text-[12px] font-semibold text-text-auth-sub">
          <button
            type="button"
            className="flex items-center gap-1.5 hover:text-text-main transition-colors"
          >
            <SortIcon className="h-3.5 w-3.5" />
            <span>Sort</span>
          </button>
          <button
            type="button"
            className="flex items-center gap-1.5 hover:text-text-main transition-colors"
          >
            <FilterIcon className="h-3.5 w-3.5" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Chart Area */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden custom-scrollbar relative pb-4">
        <div
          className="h-full flex flex-col relative"
          style={{ width: totalWidth }}
        >
          {/* Header (Dates) */}
          <div className="h-[28px] flex items-center border-b border-chart-inactive/80 relative bg-brand-300/40 z-10">
            {columns.map((c, i) => (
              <div
                key={i}
                className="w-[55px] flex justify-center text-[11px] font-semibold text-text-placeholder"
              >
                <span className="relative flex items-center gap-1">
                  {c.day} <span className="text-text-main">{c.date}</span>
                </span>
              </div>
            ))}
          </div>

          {/* Timeline Body Grid */}
          <div className="relative flex-1">
            {/* Columns Background */}
            {columns.map((_, i) => (
              <div
                key={i}
                className="absolute top-0 bottom-0 border-r border-chart-inactive/80"
                style={{ left: `${i * 55}px`, width: "55px" }}
              />
            ))}

            {/* Today Line removed for cleaner mock */}

            {/* Cards */}
            {cards.map((card) => {
              const x = (card.colStart - 1) * colWidth;
              const width = (card.colEnd - card.colStart) * colWidth;
              const y = rowOffset + (card.row - 1) * rowHeight;

              return (
                <div
                  key={card.id}
                  className="absolute flex items-center px-3 gap-2.5 rounded-[12px] h-[52px] z-20 cursor-pointer border border-chart-inactive/80 bg-white shadow-[0_4px_15px_-3px_rgba(0,0,0,0.05)] transition-transform hover:scale-[1.01] hover:z-30"
                  style={{ left: `${x}px`, top: `${y}px`, width: `${width}px` }}
                >
                  {/* Left Indicator */}
                  <div
                    className={`w-[4px] h-[30px] rounded-full shrink-0 ${card.colorClass}`}
                  />

                  {/* Text */}
                  <div className="flex flex-col min-w-0 pr-2">
                    <span className="text-[12px] font-bold truncate leading-tight tracking-tight text-text-main">
                      {card.title}
                    </span>
                    <span className="text-[10px] flex items-center gap-1.5 leading-tight mt-0.5 text-text-sub">
                      {card.subtitle}
                    </span>
                  </div>

                  {/* Menu */}
                  <div className="ml-auto flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      aria-label="캠페인 메뉴"
                      className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-brand-900/5 transition-colors text-text-placeholder"
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
