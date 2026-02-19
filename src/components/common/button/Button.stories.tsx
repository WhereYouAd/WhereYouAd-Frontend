import type { Meta, StoryObj } from "@storybook/react";

import Button from "./Button";

const meta: Meta<typeof Button> = {
  title: "Common/Button",
  component: Button,
  args: {
    children: "버튼",
    size: "small",
    variant: "primary",
  },
  parameters: { layout: "centered" },
};

export default meta;
type TButtonStory = StoryObj<typeof Button>;
export const Primary: TButtonStory = {
  args: { variant: "primary" },
};

export const Secondary: TButtonStory = {
  args: { variant: "secondary" },
};

export const Outline: TButtonStory = {
  args: { variant: "outline" },
};

export const Gradient: TButtonStory = {
  args: { variant: "gradient" },
};

export const Disabled: TButtonStory = {
  args: { disabled: true },
};

export const Loading: TButtonStory = {
  args: { isLoading: true },
};

export const Sizes: TButtonStory = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Button size="small" variant="primary">
        Small
      </Button>
      <Button size="big" variant="primary">
        Big
      </Button>
    </div>
  ),
};

export const FullWidth: TButtonStory = {
  render: () => (
    <div className="w-[360px]">
      <Button fullWidth variant="primary">
        Full width
      </Button>
    </div>
  ),
};
