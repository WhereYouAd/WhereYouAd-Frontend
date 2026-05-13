import type { Meta, StoryObj } from "@storybook/react";

import InfoCard from "./InfoCard";

const meta: Meta<typeof InfoCard> = {
  title: "Common/InfoCard",
  component: InfoCard,
  argTypes: {
    title: {
      control: "text",
      description: "카드 상단 제목",
    },
    children: {
      control: false,
      description: "카드 내부 콘텐츠 영역",
    },
    className: {
      control: "text",
      description: "추가적인 스타일 확장을 위한 클래스명",
    },
  },
};

export default meta;
type TStory = StoryObj<typeof InfoCard>;

export const Default: TStory = {
  args: {
    title: "제목",
    children: (
      <div className="flex justify-center text-text-title w-full">내용</div>
    ),
  },
};
