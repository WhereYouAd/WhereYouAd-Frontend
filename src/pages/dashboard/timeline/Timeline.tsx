import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

import type { ITimelineSummaryPanelData } from "@/types/timeline/summary";
import type {
  ITimelineCampaignBar,
  TTimelineViewUnit,
} from "@/types/timeline/ui";
import {
  TIMELINE_COL_WIDTH,
  TIMELINE_PAGE_HEIGHT,
} from "@/constants/timeline/layout";

import { buildTimelineGrid } from "@/utils/timeline/buildTimelineGrid";
import { buildTimelineSummaryPanel } from "@/utils/timeline/buildTimelineSummaryPanel";

import { useTimelineDetail } from "@/hooks/timeline/useTimelineDetail";
import { useTimelineList } from "@/hooks/timeline/useTimelineList";

import Button from "@/components/common/button/Button";
import TimelineSkeleton from "@/components/timeline/skeleton/TimelineSkeleton";
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

const TOOLBAR_ACTION_CLASS =
  "flex items-center gap-1.5 rounded-lg px-2 py-1.5 font-caption text-text-muted opacity-50 cursor-not-allowed";

export default function Timeline() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const [viewUnit, setViewUnit] = useState<TTimelineViewUnit>("WEEK");
  const [periodIndex, setPeriodIndex] = useState(0);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedBarId, setSelectedBarId] = useState<number | null>(null);
  const [panelData, setPanelData] = useState<ITimelineSummaryPanelData | null>(
    null,
  );

  const {
    data: timelineList = [],
    isLoading,
    isError,
    error,
  } = useTimelineList();

  const { data: detail } = useTimelineDetail(selectedBarId);

  const gridData = useMemo(
    () => buildTimelineGrid({ items: timelineList, viewUnit, periodIndex }),
    [timelineList, viewUnit, periodIndex],
  );
  const { columns, bars } = gridData;
  const hasNoTimelines = timelineList.length === 0;
  const hasNoVisibleBars = !hasNoTimelines && bars.length === 0;
  const periodLabel = gridData.periodLabel;

  const maxRow = useMemo(
    () => (bars.length > 0 ? Math.max(...bars.map((bar) => bar.row)) : 0),
    [bars],
  );

  const totalWidth = columns.length * TIMELINE_COL_WIDTH;

  useEffect(() => {
    if (!detail) return;
    setPanelData(buildTimelineSummaryPanel(detail));
  }, [detail]);

  useEffect(() => {
    if (hasNoTimelines) return;
    const el = scrollRef.current;
    if (!el) return;
    el.scrollLeft = el.scrollWidth - el.clientWidth;
  }, [columns, hasNoTimelines, viewUnit]);

  useEffect(() => {
    if (selectedBarId === null) return;
    if (!bars.some((bar) => bar.id === selectedBarId)) {
      setIsPanelOpen(false);
      setSelectedBarId(null);
    }
  }, [bars, selectedBarId]);

  const handleViewUnitChange = (unit: TTimelineViewUnit) => {
    setViewUnit(unit);
    setPeriodIndex(0);
  };

  const handlePrevPeriod = () => {
    setPeriodIndex((prev) => prev + 1); //더 과거
  };

  const handleNextPeriod = () => {
    setPeriodIndex((prev) => Math.max(0, prev - 1));
  };

  const handleGoToToday = () => {
    setPeriodIndex(0);
  };

  const handleBarClick = (bar: ITimelineCampaignBar) => {
    setSelectedBarId(bar.id);
    setPanelData(null);
    setIsPanelOpen(true);
  };

  const handlePanelClose = () => {
    setIsPanelOpen(false);
    setSelectedBarId(null);
  };

  if (isLoading) {
    return <TimelineSkeleton />;
  }

  if (isError) {
    return (
      <section
        className="flex w-full min-w-0 flex-col"
        style={{ height: TIMELINE_PAGE_HEIGHT }}
      >
        <div
          role="alert"
          aria-live="assertive"
          className="flex min-h-40 flex-1 items-center justify-center rounded-2xl border border-surface-400/70 bg-surface-100 p-8"
        >
          <p className="text-center font-body2 text-text-muted">
            {error?.message ??
              "타임라인을 불러오지 못했습니다. 잠시 후에 다시 시도해주세요"}
          </p>
        </div>
      </section>
    );
  }

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
        {hasNoTimelines ? (
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
              <TimelineAxis columns={columns} className="sticky top-0" />
              {hasNoVisibleBars ? (
                <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-2 px-6 py-16 text-center">
                  <p className="font-heading4 text-text-title">
                    이 기간에 표시할 타임라인이 없어요
                  </p>
                  <p className="max-w-sm font-body2 text-text-muted">
                    다른 기간으로 이동하거나 보기 단위를 변경해 보세요
                  </p>
                </div>
              ) : (
                <TimelineGrid columns={columns} rowCount={maxRow}>
                  {bars.map((bar) => (
                    <TimelineBar
                      key={`${viewUnit}-${bar.id}`}
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
              )}
            </div>
          </div>
        )}
      </div>

      <TimelineCreateModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />

      {panelData ? (
        <TimelinePerformancePanel
          isOpen={isPanelOpen}
          onClose={handlePanelClose}
          onEdit={() => toast.info("수정기능은 다음 이슈에서 연동예정")}
          onDelete={() => toast.info("삭제기능은 다음 이슈에서 연동예정")}
          data={panelData}
        />
      ) : null}
    </section>
  );
}
