import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import { DropdownMenu } from "./DropdownMenu";

const meta: Meta<typeof DropdownMenu> = {
  title: "Common/DropdownMenu",
  component: DropdownMenu,
  parameters: { layout: "centered" },
};

export default meta;
type TDropdownMenuStory = StoryObj<typeof DropdownMenu>;

export const Default: TDropdownMenuStory = {
  render: () => (
    <DropdownMenu
      trigger={<span>...</span>}
      items={[
        { label: "선택된 부분", active: true, onClick: fn() },
        { label: "선택 안 된 부분", onClick: fn() },
      ]}
    />
  ),
};
