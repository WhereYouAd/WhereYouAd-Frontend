import { Fragment } from "react";
import type { Meta, StoryObj } from "@storybook/react";

import StatCard from "./StatCard";

const meta: Meta<typeof StatCard> = {
  title: "Common/StatCard",
  component: StatCard,
  args: {
    title: "클릭수(CTR)",
    value: "1,280",
  },
  parameters: { layout: "centered" },
};

export default meta;
type TStatCardStory = StoryObj<typeof StatCard>;

export const Default: TStatCardStory = {};

export const WithTrendUp: TStatCardStory = {
  args: {
    trend: { direction: "up", value: "13.77%" },
  },
};

export const WithTrendDown: TStatCardStory = {
  args: {
    title: "노출수",
    value: "3,175,630",
    trend: { direction: "down", value: "13.77%" },
  },
};

export const KpiGroup: TStatCardStory = {
  render: () => (
    <div className="flex bg-white rounded-component-md border border-chart-inactive w-200">
      {[
        {
          title: "클릭수(CTR)",
          value: "1,280",
          trend: { direction: "up" as const, value: "13.77%" },
        },
        {
          title: "노출수",
          value: "3,175,630",
          trend: { direction: "down" as const, value: "13.77%" },
        },
        {
          title: "전환율(CVR)",
          value: "27.09%",
          trend: { direction: "up" as const, value: "13.77%" },
        },
        {
          title: "광고비 대비 매출",
          value: "37.58%",
          trend: { direction: "down" as const, value: "13.77%" },
        },
      ].map((kpi, index) => (
        <Fragment key={kpi.title}>
          {index > 0 && <div className="w-px bg-bg-disabled my-5" />}
          <StatCard className="flex-1 border-0 rounded-none" {...kpi} />
        </Fragment>
      ))}
    </div>
  ),
};
