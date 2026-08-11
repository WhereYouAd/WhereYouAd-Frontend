import { useMemo, useRef, useState } from "react";

import type { ITimelineCampaignBar } from "@/types/timeline/ui";
import {
  TIMELINE_COL_WIDTH,
  TIMELINE_PAGE_HEIGHT,
} from "@/constants/timeline/layout";

import { buildTimelineGrid } from "@/utils/timeline/buildTimelineGrid";

import { useContainerWidth } from "@/hooks/timeline/useContainerWidth";
import { useDeleteTimeline } from "@/hooks/timeline/useDeleteTimeline";
import { useTimelineEditModal } from "@/hooks/timeline/useTimelineEditModal";
import { useTimelineList } from "@/hooks/timeline/useTimelineList";
import useTimelinePanel from "@/hooks/timeline/useTimelinePanel";
import { useTimelinePeriod } from "@/hooks/timeline/useTimelinePeriod";
import { useTimelineSummaryPolling } from "@/hooks/timeline/useTimelineSummaryPolling";

import AreaErrorFallback from "@/components/common/error/AreaErrorFallback";
import { ErrorBoundary } from "@/components/common/error/ErrorBoundary";
import TimelineSkeleton from "@/components/timeline/skeleton/TimelineSkeleton";
import TimelineCanvas from "@/components/timeline/TimelineCanvas";
import TimelineCreateModal from "@/components/timeline/TimelineCreateModal";
import TimelineDeleteModal from "@/components/timeline/TimelineDeleteModal";
import TimelineEmptyState from "@/components/timeline/TimelineEmptyState";
import TimelinePerformancePanel from "@/components/timeline/TimelinePerformancePanel";
import TimelineToolbar from "@/components/timeline/TimelineToolbar";

import useTimelineStore from "@/store/useTimelineStore";

export default function Timeline() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const statusFilter = useTimelineStore((s) => s.statusFilter);
  const sort = useTimelineStore((s) => s.sort);
  const setStatusFilter = useTimelineStore((s) => s.setStatusFilter);
  const setSort = useTimelineStore((s) => s.setSort);

  const { mutate: deleteTimeline, isPending: isDeleting } = useDeleteTimeline();

  const listParams = useMemo(
    () => ({
      status: statusFilter === "ALL" ? undefined : statusFilter,
      sort,
    }),
    [statusFilter, sort],
  );

  const {
    data: timelineList = [],
    isLoading,
    isError,
    error,
  } = useTimelineList(listParams);

  const hasNoTimelines = timelineList.length === 0;

  const {
    viewUnit,
    periodIndex,
    handleViewUnitChange,
    handlePrevPeriod,
    handleNextPeriod,
    handleGoToToday,
  } = useTimelinePeriod({ scrollRef, hasNoTimelines });

  const gridData = useMemo(
    () =>
      buildTimelineGrid({
        items: timelineList,
        viewUnit: viewUnit,
        periodIndex: periodIndex,
      }),
    [timelineList, viewUnit, periodIndex],
  );

  const { columns, bars, periodLabel } = gridData;
  const hasNoVisibleBars = !hasNoTimelines && bars.length === 0;

  const maxRow = useMemo(
    () => (bars.length > 0 ? Math.max(...bars.map((bar) => bar.row)) : 0),
    [bars],
  );

  const containerWidth = useContainerWidth(scrollRef, !hasNoTimelines);
  const columnCount = columns.length;
  const colWidth =
    columnCount > 0 && containerWidth > 0
      ? Math.max(TIMELINE_COL_WIDTH, containerWidth / columnCount)
      : TIMELINE_COL_WIDTH;
  const totalWidth = columnCount * colWidth;

  const {
    isPanelOpen,
    selectedBarId,
    panelData,
    handleBarClick: selectBar,
    handlePanelClose,
  } = useTimelinePanel({ bars });

  const {
    isAwaitingSummary,
    isSummaryPending,
    handleRequestSummary,
    resetSummaryPolling,
  } = useTimelineSummaryPolling(selectedBarId);

  const handleBarClick = (bar: ITimelineCampaignBar) => {
    resetSummaryPolling();
    selectBar(bar);
  };

  const {
    editTimelineId,
    editInitialValues,
    isEditOpen,
    openEditModal,
    closeEditModal,
  } = useTimelineEditModal();

  const openDeleteModal = (target: { id: number; name: string }) => {
    setDeleteTarget(target);
  };
  const closeDeleteModal = () => {
    if (isDeleting) return;
    setDeleteTarget(null);
  };

  const handleEditTimeline = (id: number) => {
    handlePanelClose();
    openEditModal(id);
  };
  const handleDeleteTimeline = (target: { id: number; name: string }) => {
    handlePanelClose();
    openDeleteModal(target);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    deleteTimeline(deleteTarget.id, {
      onSuccess: () => {
        if (selectedBarId === deleteTarget.id) handlePanelClose();
        setDeleteTarget(null);
      },
    });
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
      <ErrorBoundary
        FallbackComponent={AreaErrorFallback}
        resetKeys={[timelineList, viewUnit, periodIndex]}
      >
        <div className="flex min-h-full flex-1 w-full min-w-0 flex-col rounded-2xl border border-surface-400/70 bg-surface-100">
          <TimelineToolbar
            viewUnit={viewUnit}
            periodLabel={periodLabel}
            onViewUnitChange={handleViewUnitChange}
            onPrevPeriod={handlePrevPeriod}
            onNextPeriod={handleNextPeriod}
            onGoToToday={handleGoToToday}
            statusFilter={statusFilter}
            sort={sort}
            onStatusFilterChange={setStatusFilter}
            onSortChange={setSort}
            onCreate={() => setIsCreateOpen(true)}
          />
          {hasNoTimelines ? (
            <TimelineEmptyState onCreate={() => setIsCreateOpen(true)} />
          ) : (
            <TimelineCanvas
              scrollRef={scrollRef}
              totalWidth={totalWidth}
              columns={columns}
              colWidth={colWidth}
              bars={bars}
              maxRow={maxRow}
              viewUnit={viewUnit}
              hasNoVisibleBars={hasNoVisibleBars}
              selectedBarId={selectedBarId}
              isPanelOpen={isPanelOpen}
              onBarClick={handleBarClick}
              onEdit={handleEditTimeline}
              onDelete={handleDeleteTimeline}
            />
          )}
        </div>
      </ErrorBoundary>
      {/* 생성 */}
      <TimelineCreateModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
      {/* 수정 */}
      <TimelineCreateModal
        isOpen={isEditOpen}
        onClose={closeEditModal}
        timelineId={editTimelineId}
        initialValues={editInitialValues}
      />
      {panelData ? (
        <TimelinePerformancePanel
          isOpen={isPanelOpen}
          onClose={handlePanelClose}
          onEdit={() => {
            if (selectedBarId == null) return;
            handleEditTimeline(selectedBarId);
          }}
          onDelete={() => {
            if (selectedBarId == null) return;
            handleDeleteTimeline({
              id: selectedBarId,
              name: panelData.timelineName,
            });
          }}
          data={panelData}
          onRequestSummary={handleRequestSummary}
          isSummaryLoading={isAwaitingSummary}
          isSummaryPending={isSummaryPending}
        />
      ) : null}
      <TimelineDeleteModal
        target={deleteTarget}
        isDeleting={isDeleting}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
      />
    </section>
  );
}
