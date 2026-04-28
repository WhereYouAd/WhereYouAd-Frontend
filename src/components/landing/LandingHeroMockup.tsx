import { lazy, Suspense } from "react";
import type { ApexOptions } from "apexcharts";

import AdsIcon from "@/assets/icon/sidebar/ads.svg?react";
import DashboardIcon from "@/assets/icon/sidebar/dashboard.svg?react";
import LogoutIcon from "@/assets/icon/sidebar/logout.svg?react";
import MapIcon from "@/assets/icon/sidebar/map.svg?react";
import NotificationIcon from "@/assets/icon/sidebar/notification.svg?react";
import SettingsIcon from "@/assets/icon/sidebar/setting.svg?react";
import WorkspaceIcon from "@/assets/icon/sidebar/workspace.svg?react";
import AiButtonSvg from "@/assets/logo/service-logo/ai-요약버튼.svg?react";

const ReactApexChart = lazy(() => import("react-apexcharts"));

const kpis = [
  { title: "클릭수", value: "308,606", up: true, trend: "6.7%" },
  { title: "노출수", value: "13.6M", up: true, trend: "7.3%" },
  { title: "전환율", value: "4.7%", up: true, trend: "2.1%" },
  { title: "ROAS", value: "204.3%", up: false, trend: "6.0%" },
];

const CLICKS = [
  32000, 33500, 34000, 35500, 36000, 37500, 45000, 46500, 47000, 46000, 50000,
  53000, 54000, 52000, 48000, 46000, 44000, 43000, 45500, 41000, 38000, 36000,
  42000, 48000, 51000,
];

const LABEL_HOURS = new Set([0, 6, 12, 18, 24]);

const chartSeries = [
  { name: "클릭수", data: CLICKS.map((y, i) => ({ x: i, y })) },
];

const chartOptions: ApexOptions = {
  chart: {
    type: "area",
    toolbar: { show: false },
    zoom: { enabled: false },
    fontFamily: "Pretendard",
    animations: { enabled: false },
    redrawOnWindowResize: false,
  },
  dataLabels: { enabled: false },
  stroke: { curve: "smooth", width: 1.5 },
  fill: { type: "solid", opacity: 0.1 },
  colors: ["var(--color-status-blue)"],
  markers: { size: 0 },
  xaxis: {
    type: "numeric",
    min: 0,
    max: 24,
    tickAmount: 24,
    labels: {
      formatter: (val: string) => {
        const n = Number(val);
        return LABEL_HOURS.has(n) ? `${String(n).padStart(2, "0")}:00` : "";
      },
      style: { colors: "var(--color-text-sub)", fontSize: "12px" },
      rotate: 0,
      rotateAlways: false,
    },
    axisBorder: { show: false },
    axisTicks: { show: false },
    tooltip: { enabled: false },
  },
  yaxis: {
    min: 0,
    max: Math.ceil(Math.max(...CLICKS) / 10000) * 10000,
    tickAmount: 5,
    labels: {
      formatter: (val: number) =>
        val === 0 ? "" : `${(val / 1000).toFixed(0)}K`,
      style: { colors: "var(--color-text-sub)", fontSize: "12px" },
    },
  },
  grid: {
    borderColor: "var(--color-chart-inactive)",
    xaxis: { lines: { show: false } },
    yaxis: { lines: { show: true } },
    padding: { left: 8, right: 8 },
  },
  tooltip: { enabled: false },
};

const CARD =
  "bg-white/80 backdrop-blur-sm rounded-component-lg shadow-card border border-white/40";

export default function LandingHeroMockup() {
  return (
    <div
      className="w-full bg-brand-300 rounded-2xl overflow-hidden flex gap-3 p-3 text-left"
      style={{ height: "730px" }}
    >
      {/* Sidebar */}
      <div className="w-20 bg-white rounded-component-lg flex flex-col items-center py-5 shrink-0">
        <div className="flex items-center justify-center shrink-0">
          <div className="grid grid-cols-2 gap-0.5 w-3.5 h-3.5">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-[1px]" />
            ))}
          </div>
        </div>
        <nav className="flex-1 flex flex-col items-center gap-1 w-full px-2">
          <div className="w-13 h-13 flex items-center justify-center rounded-[14px] bg-chart-3 text-white">
            <DashboardIcon className="w-5 h-5" />
          </div>
          {[AdsIcon, MapIcon, WorkspaceIcon].map((Icon, i) => (
            <div
              key={i}
              className="w-full h-13 flex items-center justify-center rounded-[14px] text-text-auth-sub"
            >
              <Icon className="w-5 h-5" />
            </div>
          ))}
        </nav>
        <div className="flex flex-col items-center gap-1 w-full px-2">
          {[NotificationIcon, SettingsIcon, LogoutIcon].map((Icon, i) => (
            <div
              key={i}
              className="w-full h-13 flex items-center justify-center rounded-[14px] text-text-auth-sub"
            >
              <Icon className="w-5 h-5" />
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0 overflow-hidden flex flex-col gap-3 py-1 pr-1">
        <div className="flex items-start justify-between px-3 pt-3 shrink-0">
          <div>
            <h1 className="text-xl font-bold text-text-main tracking-tight leading-tight">
              통합 대시보드
            </h1>
          </div>
          <button
            type="button"
            className="p-1.5 rounded-2xl shrink-0"
            tabIndex={-1}
          >
            <AiButtonSvg className="w-30 h-auto" />
          </button>
        </div>

        {/* StatCards */}
        <div className="grid grid-cols-4 gap-2.5 shrink-0">
          {kpis.map(({ title, value, up, trend }) => (
            <div key={title} className={`${CARD} p-3.5 flex flex-col gap-1.5`}>
              <p className="font-caption text-text-sub">{title}</p>
              <p className="text-base font-extrabold text-text-main tracking-tight leading-none">
                {value}
              </p>
              <span
                className={`inline-flex items-center gap-0.5 text-xs font-semibold ${up ? "text-status-green" : "text-status-red"}`}
              >
                {up ? "▲" : "▼"} {trend}
              </span>
            </div>
          ))}
        </div>

        {/* Traffic Chart */}
        <div
          className={`${CARD} flex-1 p-4 flex flex-col min-h-0 overflow-hidden`}
        >
          <div className="flex items-start flex-col mb-2 shrink-0">
            <h3 className="font-body2 font-semibold text-text-main">
              실시간 트래픽 변화
            </h3>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 font-caption text-text-sub">
                <span className="inline-block w-2 h-2 rounded-full bg-status-blue shrink-0" />
                클릭수
              </span>
              <span className="flex items-center gap-1.5 font-caption text-text-sub">
                <span className="inline-block w-2 h-2 rounded-full bg-status-red shrink-0" />
                이상징후
              </span>
            </div>
          </div>

          <div className="flex-1 min-h-0 [&_.apexcharts-toolbar]:hidden">
            <Suspense
              fallback={<div className="h-full bg-brand-300 rounded-lg" />}
            >
              <ReactApexChart
                type="area"
                options={chartOptions}
                series={chartSeries}
                height="100%"
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
