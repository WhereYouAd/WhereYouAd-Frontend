import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import MetricErrorFallback from "./MetricErrorFallback";

const meta: Meta<typeof MetricErrorFallback> = {
  title: "Common/Error/MetricErrorFallback",
  component: MetricErrorFallback,
  args: {
    error: new Error("지표 데이터를 불러오지 못했습니다."),
    resetErrorBoundary: fn(),
  },
  parameters: { layout: "centered" },
};

export default meta;
type TStory = StoryObj<typeof MetricErrorFallback>;

export const Default: TStory = {};

export const InGrid: TStory = {
  render: (args) => (
    <div className="grid w-200 grid-cols-4 gap-4">
      <MetricErrorFallback {...args} />
    </div>
  ),
};
