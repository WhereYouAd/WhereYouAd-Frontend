import { lazy, Suspense } from "react";

import {
  LANDING_OVERVIEW_CHART_OPTIONS,
  LANDING_OVERVIEW_CHART_SERIES,
} from "@/constants/landing/overviewChart";

import Card from "@/components/common/card/Card";
import ChartLegend from "@/components/common/chart/ChartLegend";

const ReactApexChart = lazy(() => import("react-apexcharts"));

export default function GuideOverviewChart() {
  return (
    <div className="w-full h-[420px] md:h-[500px] bg-transparent">
      <Card
        className="h-full flex flex-col"
        title="실시간 트래픽 변화"
        description={
          <ChartLegend
            items={[
              { label: "클릭수", colorClass: "bg-logo-2" },
              { label: "예측 클릭수", colorClass: "bg-brand-500" },
            ]}
          />
        }
      >
        <p className="sr-only">
          {"실시간 트래픽 변화 차트(목업). 클릭수와 예측 클릭수를 시간 흐름에 따라 비교합니다. " +
            "오후 12시 기준 클릭수 48,500, 전시간 대비 +1.9%로 표시됩니다."}
        </p>
        <Suspense
          fallback={
            <div className="flex-1 w-full rounded-2xl bg-brand-300/50" />
          }
        >
          <div className="relative flex-1 pt-12">
            <div className="absolute right-2 top-0 z-20 rounded-2xl border border-chart-inactive/80 bg-white/95 px-4 py-3 shadow-sm">
              <p className="text-[12px] font-semibold text-text-main">
                광고 클릭수 추이
              </p>
              <p className="mt-1 text-[11px] text-text-auth-sub">
                오후 12시 기준 클릭수 48,500
              </p>
              <p className="mt-0.5 text-[11px] text-text-auth-sub">
                전시간 대비 +1.9%
              </p>
            </div>
            <ReactApexChart
              type="line"
              options={LANDING_OVERVIEW_CHART_OPTIONS}
              series={LANDING_OVERVIEW_CHART_SERIES}
              height="100%"
            />
          </div>
        </Suspense>
      </Card>
    </div>
  );
}
