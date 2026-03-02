import type { IOverviewData } from "@/types/dashboard/overview";

export const overviewMockData: IOverviewData = {
  kpis: [
    {
      title: "클릭수(CTR)",
      value: "1,280",
      trend: { direction: "up", value: "13.77%" },
    },
    {
      title: "노출수",
      value: "3,175,630",
      trend: { direction: "down", value: "13.77%" },
    },
    {
      title: "전환율(CVR)",
      value: "27.09%",
      trend: { direction: "up", value: "13.77%" },
    },
    {
      title: "광고비 대비 매출",
      value: "37.58%",
      trend: { direction: "down", value: "13.77%" },
    },
  ],
};
