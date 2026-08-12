import { type RefObject, useEffect, useState } from "react";

import type { TTimelineViewUnit } from "@/types/timeline/ui";

interface IUserTimelinePeriodParams {
  scrollRef: RefObject<HTMLDivElement | null>;
  hasNoTimelines: boolean;
}

export function useTimelinePeriod({
  scrollRef,
  hasNoTimelines,
}: IUserTimelinePeriodParams) {
  const [viewUnit, setViewUnit] = useState<TTimelineViewUnit>("WEEK");
  const [periodIndex, setPeriodIndex] = useState(0);

  useEffect(() => {
    if (hasNoTimelines) return;
    const el = scrollRef.current;
    if (!el) return;
    el.scrollLeft = viewUnit === "MONTH" ? 0 : el.scrollWidth - el.clientWidth;
  }, [scrollRef, hasNoTimelines, viewUnit, periodIndex]);

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

  return {
    viewUnit,
    periodIndex,
    handleViewUnitChange,
    handlePrevPeriod,
    handleNextPeriod,
    handleGoToToday,
  };
}
