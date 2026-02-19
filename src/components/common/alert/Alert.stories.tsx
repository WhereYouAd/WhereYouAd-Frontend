import type { Meta, StoryObj } from "@storybook/react";

import Alert from "./Alert";

const meta: Meta<typeof Alert> = {
  title: "Common/Alert",
  component: Alert,
  parameters: { layout: "centered" },
};

export default meta;

type TAlertStory = StoryObj<typeof Alert>;

export const Info: TAlertStory = {
  args: { variant: "info", title: "안내", children: "정보 메시지입니다." },
};

export const Success: TAlertStory = {
  args: {
    variant: "success",
    title: "성공",
    children: "저장이 완료되었습니다.",
  },
};

export const Warning: TAlertStory = {
  args: {
    variant: "warning",
    title: "주의",
    children: "입력 값을 다시 확인해주세요.",
  },
};

export const Danger: TAlertStory = {
  args: {
    variant: "danger",
    title: "실패",
    children: "요청 처리 중 오류가 발생했습니다.",
  },
};

export const WithoutTitle: TAlertStory = {
  args: { variant: "info", children: "타이틀 없이도 사용할 수 있습니다" },
};
