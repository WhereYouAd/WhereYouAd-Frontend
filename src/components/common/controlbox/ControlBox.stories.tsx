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
    title: "캠페인 통합 운영 제어",
    description:
      "여러 광고 플랫폼의 캠페인을 하나로 묶어 성과와 운영 상태를 통합 관리합니다.\n광고 플랫폼 로그인 후 캠페인을 불러와 연결합니다.",
    buttonText: "캠페인 통합 연동하기",
    onButtonClick: () => console.log("click"),
    className: "w-full",
  },
};
