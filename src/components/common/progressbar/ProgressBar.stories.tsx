import type { Meta, StoryObj } from "@storybook/react";

import ProgressBar from "./ProgressBar";

const meta: Meta<typeof ProgressBar> = {
  title: "Common/ProgressBar",
  component: ProgressBar,
  parameters: { layout: "padded" },
};

export default meta;
type TProgressBarStory = StoryObj<typeof ProgressBar>;

export const Default: TProgressBarStory = {
  args: {
    value: 70,
    className: "w-[300px]",
  },
};
