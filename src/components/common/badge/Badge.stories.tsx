import type { Meta, StoryObj } from "@storybook/react";

import Badge from "./Badge";

const meta: Meta<typeof Badge> = {
  title: "Common/Badge",
  component: Badge,
  parameters: { layout: "centered" },
};

export default meta;
type TBadgeStory = StoryObj<typeof Badge>;

export const Syncing: TBadgeStory = {
  args: { variant: "syncing", children: "동기화중" },
};

export const Success: TBadgeStory = {
  args: { variant: "success", children: "완료" },
};

export const Inactive: TBadgeStory = {
  args: { variant: "inactive", children: "미동기화" },
};

export const Running: TBadgeStory = {
  args: { variant: "running", children: "운영중" },
};

export const Stopped: TBadgeStory = {
  args: { variant: "stopped", children: "중단" },
};

export const SizeSm: TBadgeStory = {
  args: { size: "sm", variant: "running", children: "운영중작은" },
};

export const SizeMd: TBadgeStory = {
  args: { size: "md", variant: "running", children: "운영중큰" },
};
