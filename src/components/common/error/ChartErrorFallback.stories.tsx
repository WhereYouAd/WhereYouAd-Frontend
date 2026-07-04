import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import ChartErrorFallback from "./ChartErrorFallback";

const meta: Meta<typeof ChartErrorFallback> = {
  title: "Common/Error/ChartErrorFallback",
  component: ChartErrorFallback,
  args: {
    error: new Error("차트 데이터를 불러오지 못했습니다."),
    resetErrorBoundary: fn(),
  },
  parameters: { layout: "centered" },
};

export default meta;
type TStory = StoryObj<typeof ChartErrorFallback>;

export const Default: TStory = {};

export const InCard: TStory = {
  render: (args) => (
    <div className="w-120 rounded-3xl bg-surface-100 p-7 shadow-Soft">
      <p className="mb-4 font-heading4 text-text-title">실시간 트래픽 변화</p>
      <ChartErrorFallback {...args} />
    </div>
  ),
};
