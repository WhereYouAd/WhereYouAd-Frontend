import type { Meta, StoryObj } from "@storybook/react";

import ControlBox from "./ControlBox";

const meta: Meta<typeof ControlBox> = {
  title: "Common/ControlBox",
  component: ControlBox,
  parameters: { layout: "padded" },
};

export default meta;
type TControlBoxStory = StoryObj<typeof ControlBox>;

export const Default: TControlBoxStory = {
  args: {
    title: "제목",
    description: "설명",
    buttonText: "버튼",
    onButtonClick: () => console.log("click"),
    className: "w-full",
  },
};
