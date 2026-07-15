import { twMerge } from "tailwind-merge";

import type { TTimelineViewUnit } from "@/types/timeline/ui";
import { TIMELINE_VIEW_UNIT_OPTIONS } from "@/constants/timeline/viewUnit";

import ChevronLeftIcon from "@/assets/icon/chevron/chervon-left.svg?react";
import ChevronRightIcon from "@/assets/icon/chevron/chevron-right.svg?react";

interface ITimelineViewUnitSegmentProps {
  viewUnit: TTimelineViewUnit;
  onViewUnitChange: (unit: TTimelineViewUnit) => void;
  className?: string;
}

export function TimelineViewUnitSegment({
  viewUnit,
  onViewUnitChange,
  className,
}: ITimelineViewUnitSegmentProps) {
  return (
    <div
      role="group"
      aria-label="보기 단위"
      className={twMerge(
        "flex items-center rounded-lg border border-surface-400/70 bg-surface-100 p-0.5",
        className,
      )}
    >
      {TIMELINE_VIEW_UNIT_OPTIONS.map((option) => {
        const isSelected = viewUnit === option.value;

        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onViewUnitChange(option.value)}
            className={twMerge(
              "rounded-md px-3 py-1.5 font-caption transition-ui-smooth",
              isSelected
                ? "bg-surface-100 text-text-title shadow-Soft"
                : "text-text-muted hover:text-text-body",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

interface ITimelinePeriodNavProps {
  periodLabel: string;
  onPrevPeriod: () => void;
  onNextPeriod: () => void;
  onGoToToday?: () => void;
  disablePrev?: boolean;
  disableNext?: boolean;
  className?: string;
}

export function TimelinePeriodNav({
  periodLabel,
  onPrevPeriod,
  onNextPeriod,
  onGoToToday,
  disablePrev = false,
  disableNext = false,
  className,
}: ITimelinePeriodNavProps) {
  return (
    <div
      className={twMerge(
        "flex items-center gap-3 font-body2 text-text-title",
        className,
      )}
    >
      <button
        type="button"
        aria-label="이전 기간"
        disabled={disablePrev}
        onClick={onPrevPeriod}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-text-muted transition-ui-smooth hover:bg-surface-200 hover:text-text-title"
      >
        <ChevronLeftIcon className="h-3.5 w-3.5" />
      </button>

      <span aria-live="polite" className="min-w-40 truncate text-center">
        {periodLabel}
      </span>

      <button
        type="button"
        aria-label="다음 기간"
        disabled={disableNext}
        onClick={onNextPeriod}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-text-muted transition-ui-smooth hover:bg-surface-200 hover:text-text-title"
      >
        <ChevronRightIcon className="h-3.5 w-3.5" />
      </button>

      {onGoToToday ? (
        <button
          type="button"
          onClick={onGoToToday}
          className={twMerge(
            "ml-1 rounded-lg px-3 py-1.5 font-caption text-text-muted",
            "transition-ui-smooth hover:bg-surface-200 hover:text-text-title",
          )}
        >
          오늘
        </button>
      ) : null}
    </div>
  );
}

interface ITimelinePeriodSelectorProps {
  viewUnit: TTimelineViewUnit;
  periodLabel: string;
  onViewUnitChange: (unit: TTimelineViewUnit) => void;
  onPrevPeriod: () => void;
  onNextPeriod: () => void;
  onGoToToday?: () => void;
  disablePrev?: boolean;
  disableNext?: boolean;
  className?: string;
}

export default function TimelinePeriodSelector({
  viewUnit,
  periodLabel,
  onViewUnitChange,
  onPrevPeriod,
  onNextPeriod,
  onGoToToday,
  disablePrev,
  disableNext,
  className,
}: ITimelinePeriodSelectorProps) {
  return (
    <div className={twMerge("flex flex-wrap items-center gap-4", className)}>
      <TimelineViewUnitSegment
        viewUnit={viewUnit}
        onViewUnitChange={onViewUnitChange}
      />
      <TimelinePeriodNav
        periodLabel={periodLabel}
        onPrevPeriod={onPrevPeriod}
        onNextPeriod={onNextPeriod}
        onGoToToday={onGoToToday}
        disablePrev={disablePrev}
        disableNext={disableNext}
      />
    </div>
  );
}
