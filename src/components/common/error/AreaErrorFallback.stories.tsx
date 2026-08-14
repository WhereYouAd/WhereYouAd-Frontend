import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import AreaErrorFallback from "./AreaErrorFallback";

const meta: Meta<typeof AreaErrorFallback> = {
  title: "Common/Error/AreaErrorFallback",
  component: AreaErrorFallback,
  args: {
    error: new Error("영역을 불러오지 못했습니다."),
    resetErrorBoundary: fn(),
  },
  parameters: { layout: "centered" },
};

export default meta;
type TStory = StoryObj<typeof AreaErrorFallback>;

export const Default: TStory = {};

export const InCard: TStory = {
  render: (args) => (
    <div className="w-120 rounded-3xl bg-surface-100 p-7 shadow-Soft">
      <p className="mb-4 font-heading4 text-text-title">캠페인 목록</p>
      <AreaErrorFallback {...args} />
    </div>
  ),
};
