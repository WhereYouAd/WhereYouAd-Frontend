import type { Meta, StoryObj } from "@storybook/react";

import Input from "./Input";

const meta: Meta<typeof Input> = {
  title: "Common/Input",
  component: Input,
  args: {
    label: "제목",
    placeholder: "placeholder",
  },
  parameters: { layout: "centered" },
};

export default meta;

type TInputStory = StoryObj<typeof Input>;

export const Default: TInputStory = {};

export const HelperText: TInputStory = {
  args: { helperText: "도움말 텍스트" },
};

export const Error: TInputStory = {
  args: {
    error: true,
    helperText: "에러 메시지",
  },
};

export const Success: TInputStory = {
  args: {
    success: true,
    helperText: "성공 메시지",
    value: "정상 입력",
  },
};

export const Disabled: TInputStory = {
  args: {
    disabled: true,
    value: "비활성",
  },
};

export const RightElement: TInputStory = {
  args: {
    rightElement: (
      <button
        type="button"
        className="font-body2 text-text-sub hover:text-text-disabled"
      >
        지우기
      </button>
    ),
  },
};
