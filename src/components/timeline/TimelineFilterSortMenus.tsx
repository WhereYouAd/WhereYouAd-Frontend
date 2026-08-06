import { twMerge } from "tailwind-merge";

import type { TTimelineSort } from "@/types/timeline/api";
import {
  TIMELINE_SORT_OPTIONS,
  TIMELINE_STATUS_FILTER_OPTIONS,
  type TTimelineStatusFilter,
} from "@/constants/timeline/filterSort";

import {
  DropdownMenu,
  type TMenuItem,
} from "../common/dropdownmenu/DropdownMenu";

import FilterIcon from "@/assets/icon/timeline/filter.svg?react";
import SortIcon from "@/assets/icon/timeline/sort.svg?react";

const TOOLBAR_ACTIONS_CLASS =
  "flex cursor-pointer items-center gap-1.5 rounded-lg px-2 py-1.5 font-caption text-text-muted transition-all hover:bg-surface-200 hover:text-text-body";

interface ITimelineFilterSortMenusProps {
  statusFilter: TTimelineStatusFilter;
  sort: TTimelineSort;
  onStatusFilterChange: (value: TTimelineStatusFilter) => void;
  onSortChange: (value: TTimelineSort) => void;
  className?: string;
}

export default function TimelineFilterSortMenus({
  statusFilter,
  sort,
  onStatusFilterChange,
  onSortChange,
  className,
}: ITimelineFilterSortMenusProps) {
  const sortItems: TMenuItem[] = TIMELINE_SORT_OPTIONS.map((opt) => ({
    label: opt.label,
    active: sort === opt.value,
    onClick: () => onSortChange(opt.value),
  }));

  const filterItems: TMenuItem[] = TIMELINE_STATUS_FILTER_OPTIONS.map(
    (opt) => ({
      label: opt.label,
      active: statusFilter === opt.value,
      onClick: () => onStatusFilterChange(opt.value),
    }),
  );
  return (
    <div className={twMerge("flex items-center gap-3", className)}>
      <DropdownMenu
        aria-label="타임라인 정렬"
        items={sortItems}
        trigger={
          <span className={TOOLBAR_ACTIONS_CLASS}>
            <SortIcon className="h-4 w-4" />
            Sort
          </span>
        }
      />
      <DropdownMenu
        aria-label="성과 상태 필터"
        items={filterItems}
        trigger={
          <span className={TOOLBAR_ACTIONS_CLASS}>
            <FilterIcon className="h-4 w-4" />
            Filter
          </span>
        }
      />
    </div>
  );
}
