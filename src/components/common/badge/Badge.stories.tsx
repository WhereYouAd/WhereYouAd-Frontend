import type { Meta, StoryObj } from "@storybook/react";

import Badge from "./Badge";

const meta: Meta<typeof Badge> = {
  title: "Common/Badge",
  component: Badge,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "variant는 **토큰 색 이름**과 맞춤: `infoYellow` · `infoBlue`(기본) · `infoRed` · `surface`. 크기는 **sm 고정** (`h-7` · `font-caption`).",
      },
    },
  },
};

export default meta;
type TBadgeStory = StoryObj<typeof Badge>;

export const InfoYellow: TBadgeStory = {
  name: "infoYellow",
  args: { variant: "infoYellow", children: "예산 주의" },
};

export const InfoBlue: TBadgeStory = {
  name: "infoBlue (기본)",
  args: { variant: "infoBlue", children: "운영 중" },
};

export const InfoRed: TBadgeStory = {
  name: "infoRed",
  args: { variant: "infoRed", children: "예산 위험" },
};

export const Surface: TBadgeStory = {
  name: "surface",
  args: { variant: "surface", children: "중단" },
};
