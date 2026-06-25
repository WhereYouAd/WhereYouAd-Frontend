import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

import {
  TIMELINE_GRID_MOCK,
  TIMELINE_SUMMARY_PANEL_MOCK,
} from "@/types/timeline/timeline.mock";
import type {
  ITimelineCampaignBar,
  TTimelineViewUnit,
} from "@/types/timeline/ui";
import { TIMELINE_COL_WIDTH } from "@/constants/timeline/layout";

import Button from "@/components/common/button/Button";
import TimelineAxis from "@/components/timeline/TimelineAxis";
import TimelineBar from "@/components/timeline/TimelineBar";
import TimelineCreateModal from "@/components/timeline/TimelineCreateModal";
import TimelineGrid from "@/components/timeline/TimelineGrid";
import TimelinePerformancePanel from "@/components/timeline/TimelinePerformancePanel";
import TimelinePeriodSelector from "@/components/timeline/TimelinePeriodSelector";

import PlusIcon from "@/assets/icon/common/plus.svg?react";
import FilterIcon from "@/assets/icon/timeline/filter.svg?react";
import SortIcon from "@/assets/icon/timeline/sort.svg?react";

const MOCK_PERIOD_LABELS: Record<TTimelineViewUnit, string[]> = {
  DAY: ["오늘", "23 Jun", "24 Jun"],
  WEEK: [
    TIMELINE_GRID_MOCK.periodLabel,
    "28 June - 4 July",
    "5 July - 11 July",
  ],
  MONTH: ["오늘", "July 2026", "Auguest 2026"],
};

export default function Timeline() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const [viewUnit, setViewUnit] = useState<TTimelineViewUnit>(
    TIMELINE_GRID_MOCK.viewUnit,
  );
  const [periodIndex, setPeriodIndex] = useState(0);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedBarId, setSelectedBarId] = useState<number | null>(null);

  const { columns, bars } = TIMELINE_GRID_MOCK;

  const maxRow = useMemo(
    () => (bars.length > 0 ? Math.max(...bars.map((bar) => bar.row)) : 0),
    [bars],
  );

  const totalWidth = columns.length * TIMELINE_COL_WIDTH;

  const periodLabels = MOCK_PERIOD_LABELS[viewUnit];
  const periodLabel = periodLabels[periodIndex] ?? periodLabels[0];

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollLeft = el.scrollWidth - el.clientWidth;
  }, [columns]);

  const handleViewUnitChange = (unit: TTimelineViewUnit) => {
    setViewUnit(unit);
    setPeriodIndex(0);
  };

  const handlePrevPeriod = () => {
    setPeriodIndex((prev) => (prev === 0 ? periodLabels.length - 1 : prev - 1));
  };

  const handleNextPeriod = () => {
    setPeriodIndex((prev) => (prev === periodLabels.length - 1 ? 0 : prev + 1));
  };

  const handleBarClick = (bar: ITimelineCampaignBar) => {
    setSelectedBarId(bar.id);
    setIsPanelOpen(true);
  };

  return (
    <section className="w-full flex flex-col gap-8 min-w-0">
      <div className="flex w-full min-w-0 flex-col overflow-hidden rounded-2xl border border-surface-400/70 bg-surface-100">
        {/* 툴바 */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-surface-400/80 px-5 py-3">
          <TimelinePeriodSelector
            viewUnit={viewUnit}
            periodLabel={periodLabel}
            onViewUnitChange={handleViewUnitChange}
            onPrevPeriod={handlePrevPeriod}
            onNextPeriod={handleNextPeriod}
          />
          <div className="flex items-center gap-5 font-caption text-text-muted">
            <Button
              type="button"
              size="small"
              variant="custom"
              onClick={() => setIsCreateOpen(true)}
              leftIcon={
                <PlusIcon
                  className="h-4 w-4 shrink-0 text-primary-450"
                  aria-hidden
                />
              }
              className={twMerge(
                "h-10 rounded-2xl px-4",
                "bg-primary-400/20 text-primary-500",
                "font-body2 shadow-Soft",
                "transition-ui-smooth hover:bg-primary-500/30",
              )}
            >
              타임라인 생성
            </Button>
            <button
              type="button"
              aria-label="정렬"
              onClick={() => toast.info("정렬기능 준비중입니다.")}
              className="flex items-center gap-1.5 transition-colors hover:text-text-title"
            >
              <SortIcon className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="정렬"
              onClick={() => toast.info("필터 기능 준비중입니다.")}
              className="flex items-center gap-1.5 transition-colors hover:text-text-title"
            >
              <FilterIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
        {/* 캔버스 */}
        <div
          ref={scrollRef}
          className="h-105 w-full overflow-x-auto overflow-y-hidden"
        >
          <div
            style={{ width: totalWidth }}
            className="flex h-full min-h-0 flex-col"
          >
            <TimelineAxis columns={columns} />
            <TimelineGrid columns={columns} rowCount={maxRow}>
              {bars.map((bar) => (
                <TimelineBar
                  key={bar.id}
                  bar={bar}
                  onBarClick={handleBarClick}
                  onEdit={() =>
                    toast.info("수정기능은 다음 이슈에서 연동됩니다")
                  }
                  onDelete={() =>
                    toast.info("삭제기능은 다음 이슈에서 연동됩니다")
                  }
                />
              ))}
            </TimelineGrid>
          </div>
        </div>
      </div>

      <TimelineCreateModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />

      <TimelinePerformancePanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        onEdit={() => toast.info("수정기능은 다음 이슈에서 연동예정")}
        onDelete={() => toast.info("삭제기능은 다음 이슈에서 연동예정")}
        data={{
          ...TIMELINE_SUMMARY_PANEL_MOCK,
          timelineName:
            bars.find((bar) => bar.id === selectedBarId)?.title ??
            TIMELINE_SUMMARY_PANEL_MOCK.timelineName,
        }}
      />
    </section>
  );
}
