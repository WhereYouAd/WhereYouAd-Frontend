import { lazy, Suspense, useState } from "react";
import type { ApexOptions } from "apexcharts";

import {
  LANDING_OVERVIEW_CHART_OPTIONS,
  LANDING_OVERVIEW_CHART_SERIES,
  NORMALIZED_CLICKS,
} from "@/constants/landing/overviewChart";

import Card from "@/components/common/card/Card";
import ChartLegend from "@/components/common/chart/ChartLegend";
import { DropdownMenu } from "@/components/common/dropdownmenu/DropdownMenu";

import ChevronDown from "@/assets/icon/chevron/chevron-down.svg?react";

const ReactApexChart = lazy(() => import("react-apexcharts"));

type TPlatformFilter = "통합" | "NAVER" | "META" | "GOOGLE";

const PLATFORM_COLORS: Record<
  TPlatformFilter,
  { primary: string; secondary: string }
> = {
  통합: {
    primary: "var(--color-primary-400)",
    secondary: "var(--color-primary-500)",
  },
  NAVER: { primary: "#03c75a", secondary: "#02a04a" },
  META: { primary: "#1877f2", secondary: "#0d5fcc" },
  GOOGLE: { primary: "#f9ab00", secondary: "#e09600" },
};

const PLATFORM_OPTIONS: TPlatformFilter[] = ["통합", "NAVER", "META", "GOOGLE"];

const SPLIT_INDEX = 12;
const SPLIT_Y = 48500;

const PLATFORM_SERIES = [
  {
    name: "클릭수",
    data: NORMALIZED_CLICKS.map((y, i) => ({ x: i, y })),
  },
];

function getChartOptions(
  primary: string,
  secondary: string,
  isUnified: boolean,
): ApexOptions {
  return {
    ...LANDING_OVERVIEW_CHART_OPTIONS,
    colors: isUnified ? [primary, secondary] : [primary],
    stroke: isUnified
      ? {
          curve: "smooth",
          width: [3.5, 3.2],
          dashArray: [0, 6],
          lineCap: "round",
        }
      : {
          curve: "smooth",
          width: [3.5],
          dashArray: [0],
          lineCap: "round",
        },
    annotations: isUnified
      ? {
          xaxis: [
            { x: SPLIT_INDEX, borderColor: secondary, strokeDashArray: 0 },
          ],
          points: [
            {
              x: SPLIT_INDEX,
              y: SPLIT_Y,
              marker: { size: 5, fillColor: primary, strokeColor: primary },
            },
          ],
        }
      : {},
  };
}

export default function GuideOverviewChart() {
  const [selected, setSelected] = useState<TPlatformFilter>("통합");

  const { primary, secondary } = PLATFORM_COLORS[selected];
  const isUnified = selected === "통합";
  const chartOptions = getChartOptions(primary, secondary, isUnified);

  return (
    <div className="w-full h-90 md:h-110 bg-transparent">
      <Card
        className="h-full flex flex-col"
        title="실시간 트래픽 변화"
        description={
          <ChartLegend items={[{ label: "클릭수", color: primary }]} />
        }
        RightElement={
          <DropdownMenu
            trigger={(open) => (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-surface-400/70 bg-surface-100 font-body2 text-text-title transition-colors hover:bg-surface-200 cursor-pointer">
                <span>{selected}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-text-muted transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                />
              </div>
            )}
            menuClassName="w-32"
            items={PLATFORM_OPTIONS.map((option) => ({
              label: option,
              active: option === selected,
              onClick: () => setSelected(option),
            }))}
          />
        }
      >
        <p className="sr-only">
          {"실시간 트래픽 변화 차트(목업). 클릭수와 예측 클릭수를 시간 흐름에 따라 비교합니다. " +
            "오후 12시 기준 클릭수 48,500, 전시간 대비 +1.9%로 표시됩니다."}
        </p>
        <Suspense
          fallback={
            <div className="flex-1 w-full rounded-2xl bg-primary-100/50" />
          }
        >
          <div className="relative flex-1 pt-12">
            {isUnified && (
              <div className="absolute right-2 top-0 z-20 rounded-2xl border border-surface-400/80 bg-surface-100/95 px-4 py-3 shadow-Soft">
                <p className="font-caption text-text-title">광고 클릭수 추이</p>
                <p className="mt-1 font-caption text-text-auth-sub">
                  오후 12시 기준 클릭수 48,500
                </p>
                <p className="mt-0.5 font-caption text-text-auth-sub">
                  전시간 대비 +1.9%
                </p>
              </div>
            )}
            <ReactApexChart
              key={selected}
              type="line"
              options={chartOptions}
              series={
                isUnified ? LANDING_OVERVIEW_CHART_SERIES : PLATFORM_SERIES
              }
              height="100%"
            />
          </div>
        </Suspense>
      </Card>
    </div>
  );
}
