import type { Meta, StoryObj } from "@storybook/react";

import Card from "./Card";
import Button from "../button/Button";

const meta: Meta<typeof Card> = {
  title: "Common/Card",
  component: Card,
  args: {
    title: "카드 제목",
    className: "w-80",
  },
  parameters: { layout: "centered" },
};

export default meta;
type TCardStory = StoryObj<typeof Card>;

export const Default: TCardStory = {
  args: {
    title: undefined,
    children: (
      <p className="font-body2 text-text-auth-sub">카드 내용이 들어갑니다.</p>
    ),
  },
};

export const WithTitle: TCardStory = {
  args: {
    children: (
      <p className="font-body2 text-text-auth-sub">카드 내용이 들어갑니다.</p>
    ),
  },
};

export const WithDescription: TCardStory = {
  args: {
    description: "제목에 대한 설명이 들어갑니다.",
    children: (
      <p className="font-body2 text-text-auth-sub">카드 내용이 들어갑니다.</p>
    ),
  },
};

export const WithRightElement: TCardStory = {
  args: {
    RightElement: <Button size="small">플랫폼 대시보드 보기</Button>,
    children: (
      <p className="font-body2 text-text-auth-sub">카드 내용이 들어갑니다.</p>
    ),
  },
};

export const WithDescriptionAndRightElement: TCardStory = {
  args: {
    description: "데이터 기준 | 2026.01.06 09:13",
    RightElement: <Button size="small">보기</Button>,
    children: (
      <p className="font-body2 text-text-auth-sub">카드 내용이 들어갑니다.</p>
    ),
  },
};
