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
import {
  TIMELINE_COL_WIDTH,
  TIMELINE_PAGE_HEIGHT,
} from "@/constants/timeline/layout";

import Button from "@/components/common/button/Button";
import TimelineAxis from "@/components/timeline/TimelineAxis";
import TimelineBar from "@/components/timeline/TimelineBar";
import TimelineCreateModal from "@/components/timeline/TimelineCreateModal";
import TimelineEmptyState from "@/components/timeline/TimelineEmptyState";
import TimelineGrid from "@/components/timeline/TimelineGrid";
import TimelinePerformancePanel from "@/components/timeline/TimelinePerformancePanel";
import {
  TimelinePeriodNav,
  TimelineViewUnitSegment,
} from "@/components/timeline/TimelinePeriodSelector";
import TimelineStatusLegend from "@/components/timeline/TimelineStatusLegend";

import PlusIcon from "@/assets/icon/common/plus.svg?react";
import FilterIcon from "@/assets/icon/timeline/filter.svg?react";
import SortIcon from "@/assets/icon/timeline/sort.svg?react";

const MOCK_PERIOD_LABELS: Record<TTimelineViewUnit, string[]> = {
  DAY: ["오늘", "6월 23일", "6월 24일"],
  WEEK: ["오늘", TIMELINE_GRID_MOCK.periodLabel, "6월 28일 - 7월 4일"],
  MONTH: ["오늘", "2026년 6월", "2026년 7월"],
};

const TOOLBAR_ACTION_CLASS =
  "flex items-center gap-1.5 rounded-lg px-2 py-1.5 font-caption text-text-muted opacity-50 cursor-not-allowed";

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
  const isEmpty = bars.length === 0;

  const maxRow = useMemo(
    () => (bars.length > 0 ? Math.max(...bars.map((bar) => bar.row)) : 0),
    [bars],
  );

  const totalWidth = columns.length * TIMELINE_COL_WIDTH;

  const periodLabels = MOCK_PERIOD_LABELS[viewUnit];
  const periodLabel = periodLabels[periodIndex] ?? periodLabels[0];

  useEffect(() => {
    if (isEmpty) return;
    const el = scrollRef.current;
    if (!el) return;
    el.scrollLeft = el.scrollWidth - el.clientWidth;
  }, [columns, isEmpty]);

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

  const handleGoToToday = () => {
    setPeriodIndex(0);
  };

  const handleBarClick = (bar: ITimelineCampaignBar) => {
    setSelectedBarId(bar.id);
    setIsPanelOpen(true);
  };

  const handlePanelClose = () => {
    setIsPanelOpen(false);
    setSelectedBarId(null);
  };

  return (
    <section
      className="flex w-full min-w-0 flex-col"
      style={{ height: TIMELINE_PAGE_HEIGHT }}
    >
      <div className="flex min-h-0 flex-1 w-full min-w-0 flex-col rounded-2xl border border-surface-400/70 bg-surface-100">
        <div className="flex shrink-0 flex-col gap-4 border-b border-surface-400/80 px-5 py-5">
          <div className="flex items-center justify-between gap-12">
            <TimelineStatusLegend />
            <Button
              type="button"
              size="small"
              variant="custom"
              onClick={() => setIsCreateOpen(true)}
              leftIcon={
                <PlusIcon
                  className="h-4 w-4 shrink-0 text-primary-500"
                  aria-hidden
                />
              }
              className={twMerge(
                "h-10 shrink-0 rounded-2xl px-4",
                "bg-primary-400/20 text-primary-500",
                "font-body2 shadow-Soft",
                "transition-ui-smooth hover:bg-primary-500/30",
              )}
            >
              타임라인 생성
            </Button>
          </div>

          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
            <TimelineViewUnitSegment
              viewUnit={viewUnit}
              onViewUnitChange={handleViewUnitChange}
              className="justify-self-start"
            />
            <TimelinePeriodNav
              periodLabel={periodLabel}
              onPrevPeriod={handlePrevPeriod}
              onNextPeriod={handleNextPeriod}
              onGoToToday={handleGoToToday}
              className="justify-self-center"
            />
            <div className="flex items-center justify-self-end gap-3">
              <span
                className={TOOLBAR_ACTION_CLASS}
                title="준비 중"
                aria-disabled
              >
                <SortIcon className="h-4 w-4" />
                Sort
              </span>
              <span
                className={TOOLBAR_ACTION_CLASS}
                title="준비 중"
                aria-disabled
              >
                <FilterIcon className="h-4 w-4" />
                Filter
              </span>
            </div>
          </div>
        </div>

        {isEmpty ? (
          <TimelineEmptyState onCreate={() => setIsCreateOpen(true)} />
        ) : (
          <div
            ref={scrollRef}
            className="flex min-h-0 w-full flex-1 flex-col overflow-auto"
          >
            <div
              style={{ width: totalWidth, minHeight: "100%" }}
              className="flex min-h-full flex-1 flex-col"
            >
              <TimelineAxis columns={columns} className="sticky top-0 z-20" />
              <TimelineGrid columns={columns} rowCount={maxRow}>
                {bars.map((bar) => (
                  <TimelineBar
                    key={bar.id}
                    bar={bar}
                    isSelected={selectedBarId === bar.id && isPanelOpen}
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
        )}
      </div>

      <TimelineCreateModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />

      <TimelinePerformancePanel
        isOpen={isPanelOpen}
        onClose={handlePanelClose}
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
