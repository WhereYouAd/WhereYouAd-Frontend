import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import type { TTimelineViewUnit } from "@/types/timeline/ui";

import TimelinePeriodSelector from "./TimelinePeriodSelector";

const MOCK_PERIOD_LABELS: Record<TTimelineViewUnit, string[]> = {
  DAY: ["오늘", "23 Jun", "24 Jun"],
  WEEK: ["오늘", "28 June - 4 July", "5 July - 11 July"],
  MONTH: ["오늘", "July 2026", "August 2026"],
};

const meta: Meta<typeof TimelinePeriodSelector> = {
  title: "Timeline/PeriodSelector",
  component: TimelinePeriodSelector,
  parameters: { layout: "padded" },
  args: {
    viewUnit: "WEEK",
    periodLabel: "27 Dec - 4 JAN",
    onViewUnitChange: fn(),
    onPrevPeriod: fn(),
    onNextPeriod: fn(),
  },
  decorators: [
    (Story) => (
      <div className="flex w-full max-w-3xl justify-end rounded-2xl border border-surface-400/70 bg-surface-100 px-5 py-3">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type TStory = StoryObj<typeof TimelinePeriodSelector>;
export const Default: TStory = {};

function InteractivePreview() {
  const [viewUnit, setViewUnit] = useState<TTimelineViewUnit>("WEEK");
  const [index, setIndex] = useState(0);

  const labels = MOCK_PERIOD_LABELS[viewUnit];
  const periodLabel = labels[index] ?? labels[0];

  const handleViewUnitChange = (unit: TTimelineViewUnit) => {
    setViewUnit(unit);
    setIndex(0);
  };

  const handlePrev = () => {
    setIndex((prev) => (prev === 0 ? labels.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setIndex((prev) => (prev === labels.length - 1 ? 0 : prev + 1));
  };

  return (
    <TimelinePeriodSelector
      viewUnit={viewUnit}
      periodLabel={periodLabel}
      onViewUnitChange={handleViewUnitChange}
      onPrevPeriod={handlePrev}
      onNextPeriod={handleNext}
    />
  );
}

export const Interactive: TStory = {
  render: () => <InteractivePreview />,
};
