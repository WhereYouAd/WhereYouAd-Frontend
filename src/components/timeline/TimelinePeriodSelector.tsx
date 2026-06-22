import { useEffect, useId, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

import type { TTimelineViewUnit } from "@/types/timeline/ui";
import { TIMELINE_VIEW_UNIT_OPTIONS } from "@/constants/timeline/viewUnit";

import ChevronLeftIcon from "@/assets/icon/chevron/chervon-left.svg?react";
import ChevronDownIcon from "@/assets/icon/chevron/chevron-down.svg?react";
import ChevronRightIcon from "@/assets/icon/chevron/chevron-right.svg?react";

interface ITimelinePeriodSelectorProps {
  viewUnit: TTimelineViewUnit;
  periodLabel: string;
  onViewUnitChange: (unit: TTimelineViewUnit) => void;
  onPrevPeriod: () => void;
  onNextPeriod: () => void;
  className?: string;
}

export default function TimelinePeriodSelector({
  viewUnit,
  periodLabel,
  onViewUnitChange,
  onPrevPeriod,
  onNextPeriod,
  className,
}: ITimelinePeriodSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  const selectedLabel =
    TIMELINE_VIEW_UNIT_OPTIONS.find((option) => option.value === viewUnit)
      ?.label ?? "주";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelectViewUnit = (unit: TTimelineViewUnit) => {
    onViewUnitChange(unit);
    setIsOpen(false);
  };

  return (
    <div className={twMerge("flex items-center gap-4 justify-end", className)}>
      {/* 기간 이동 */}
      <div className="flex items-center gap-3 font-body2 text-text-title">
        <button
          type="button"
          aria-label="이전 기간"
          onClick={onPrevPeriod}
          className="transition-colors hover:text-text-muted"
        >
          <ChevronLeftIcon className="h-3.5 w-3.5" />
        </button>
        <span aria-live="polite">{periodLabel}</span>
        <button type="button" aria-label="다음 기간" onClick={onNextPeriod}>
          <ChevronRightIcon className="h-3.5 w-3.5" />
        </button>
      </div>
      <div ref={containerRef} className="relative">
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={isOpen}
          aria-controls={menuId}
          aria-label="보기 단위 선택"
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex items-center gap-1  px-3 py-2 font-body2 text-text-title transition-colors hover:bg-surface-200/50"
        >
          <span>{selectedLabel}</span>
          <ChevronDownIcon
            className={twMerge(
              "h-4 w-4 text-text-muted transition-transform",
              isOpen && "rotate-180",
            )}
          />
        </button>
        {isOpen ? (
          <div
            id={menuId}
            role="menu"
            aria-label="보기 단위"
            className="absolute right-0 top-full z-50 mt-2 w-30 rounded-2xl border border-surface-300 bg-surface-100 py-3 shadow-Soft"
          >
            <p className="px-4 pb-2 font-caption text-text-muted">시간</p>
            <div className="space-y-1 px-1">
              {TIMELINE_VIEW_UNIT_OPTIONS.map((option) => {
                const isSelected = viewUnit == option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    role="menuitem"
                    onClick={() => handleSelectViewUnit(option.value)}
                    className={twMerge(
                      "flex w-full rounded-xl px-4 py-2.5 text-left font-body2 transition-colors",
                      isSelected
                        ? "bg-info-blue/10 text-info-blue"
                        : "text-text-body hover:bg-primary-100/80 hover:text-info-blue",
                    )}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
