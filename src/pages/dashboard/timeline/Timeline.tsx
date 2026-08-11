import { useMemo, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

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

import Button from "@/components/common/button/Button";
import AreaErrorFallback from "@/components/common/error/AreaErrorFallback";
import { ErrorBoundary } from "@/components/common/error/ErrorBoundary";
import Modal from "@/components/common/modal/Modal";
import ModalContent from "@/components/common/modal/ModalContent";
import TimelineSkeleton from "@/components/timeline/skeleton/TimelineSkeleton";
import TimelineAxis from "@/components/timeline/TimelineAxis";
import TimelineBar from "@/components/timeline/TimelineBar";
import TimelineCreateModal from "@/components/timeline/TimelineCreateModal";
import TimelineEmptyState from "@/components/timeline/TimelineEmptyState";
import TimelineFilterSortMenus from "@/components/timeline/TimelineFilterSortMenus";
import TimelineGrid from "@/components/timeline/TimelineGrid";
import TimelinePerformancePanel from "@/components/timeline/TimelinePerformancePanel";
import {
  TimelinePeriodNav,
  TimelineViewUnitSegment,
} from "@/components/timeline/TimelinePeriodSelector";
import TimelineStatusLegend from "@/components/timeline/TimelineStatusLegend";

import PlusIcon from "@/assets/icon/common/plus.svg?react";
import TrashIcon from "@/assets/icon/common/trash.svg?react";
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
          <div className="flex shrink-0 flex-col gap-4 border-b border-surface-400/80 px-5 py-5 tablet:px-4 tablet:py-4 tablet:gap-3">
            <div className="flex items-center justify-between gap-8 tablet:flex-col tablet:items-stretch tablet:gap-3">
              <TimelineStatusLegend className="min-w-0 flex-1" />
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
                  "tablet:w-full tablet:justify-center",
                )}
              >
                타임라인 생성
              </Button>
            </div>

            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 tablet:grid-cols-1 tablet:gap-3">
              <TimelineViewUnitSegment
                viewUnit={viewUnit}
                onViewUnitChange={handleViewUnitChange}
                className="justify-self-start tablet:justify-self-stretch tablet:w-full"
              />
              <TimelinePeriodNav
                periodLabel={periodLabel}
                onPrevPeriod={handlePrevPeriod}
                onNextPeriod={handleNextPeriod}
                onGoToToday={handleGoToToday}
                className="justify-self-center"
              />
              <TimelineFilterSortMenus
                statusFilter={statusFilter}
                sort={sort}
                onStatusFilterChange={setStatusFilter}
                onSortChange={setSort}
                className="justify-self-end"
              />
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
                <TimelineAxis
                  columns={columns}
                  colWidth={colWidth}
                  className="sticky top-0"
                />
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
                  <TimelineGrid
                    columns={columns}
                    rowCount={maxRow}
                    colWidth={colWidth}
                  >
                    {bars.map((bar) => (
                      <TimelineBar
                        key={`${viewUnit}-${bar.id}`}
                        bar={bar}
                        colWidth={colWidth}
                        menuPlacement={bar.row === maxRow ? "top" : "auto"}
                        isSelected={selectedBarId === bar.id && isPanelOpen}
                        onBarClick={handleBarClick}
                        onEdit={() => handleEditTimeline(bar.id)}
                        onDelete={() =>
                          handleDeleteTimeline({ id: bar.id, name: bar.title })
                        }
                      />
                    ))}
                  </TimelineGrid>
                )}
              </div>
            </div>
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
      <Modal
        isOpen={deleteTarget != null}
        onClose={closeDeleteModal}
        title="타임라인 삭제"
        disableOverlayClick={isDeleting}
      >
        <ModalContent
          icon={<TrashIcon className="h-7 w-7 text-info-red" />}
          title="해당 타임라인을 삭제할까요?"
          description={
            deleteTarget
              ? `"${deleteTarget.name}" 타임라인을 삭제하면 복구할 수 없습니다`
              : ""
          }
          buttonText="삭제하기"
          onConfirm={handleConfirmDelete}
          isLoading={isDeleting}
          variant="danger"
        />
      </Modal>
    </section>
  );
}
