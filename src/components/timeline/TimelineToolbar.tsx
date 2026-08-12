import { twMerge } from "tailwind-merge";

import type { TTimelineSort } from "@/types/timeline/api";
import type { TTimelineViewUnit } from "@/types/timeline/ui";
import type { TTimelineStatusFilter } from "@/constants/timeline/filterSort";

import TimelineFilterSortMenus from "./TimelineFilterSortMenus";
import {
  TimelinePeriodNav,
  TimelineViewUnitSegment,
} from "./TimelinePeriodSelector";
import TimelineStatusLegend from "./TimelineStatusLegend";
import Button from "../common/button/Button";

import PlusIcon from "@/assets/icon/common/plus.svg?react";

interface ITimelineToolbarProps {
  viewUnit: TTimelineViewUnit;
  periodLabel: string;
  onViewUnitChange: (unit: TTimelineViewUnit) => void;
  onPrevPeriod: () => void;
  onNextPeriod: () => void;
  onGoToToday: () => void;
  statusFilter: TTimelineStatusFilter;
  sort: TTimelineSort;
  onStatusFilterChange: (value: TTimelineStatusFilter) => void;
  onSortChange: (value: TTimelineSort) => void;
  onCreate: () => void;
}

export default function TimelineToolbar({
  viewUnit,
  periodLabel,
  onViewUnitChange,
  onPrevPeriod,
  onNextPeriod,
  onGoToToday,
  statusFilter,
  sort,
  onStatusFilterChange,
  onSortChange,
  onCreate,
}: ITimelineToolbarProps) {
  return (
    <div className="flex shrink-0 flex-col gap-4 border-b border-surface-400/80 px-5 py-5 tablet:px-4 tablet:py-4 tablet:gap-3">
      <div className="flex items-center justify-between gap-8 tablet:flex-col tablet:items-stretch tablet:gap-3">
        <TimelineStatusLegend className="min-w-0 flex-1" />
        <Button
          type="button"
          size="small"
          variant="custom"
          onClick={onCreate}
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
          onViewUnitChange={onViewUnitChange}
          className="justify-self-start tablet:justify-self-stretch tablet:w-full"
        />
        <TimelinePeriodNav
          periodLabel={periodLabel}
          onPrevPeriod={onPrevPeriod}
          onNextPeriod={onNextPeriod}
          onGoToToday={onGoToToday}
          className="justify-self-center"
        />
        <TimelineFilterSortMenus
          statusFilter={statusFilter}
          sort={sort}
          onStatusFilterChange={onStatusFilterChange}
          onSortChange={onSortChange}
          className="justify-self-end"
        />
      </div>
    </div>
  );
}
