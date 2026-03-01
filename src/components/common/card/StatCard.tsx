import type { HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

import TrendDownIcon from "@/assets/icon/dashboard/trend-down.svg?react";
import TrendUpIcon from "@/assets/icon/dashboard/trend-up.svg?react";

export interface ITrend {
  direction: "up" | "down";
  value: string;
}

export interface IStatCardProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  trend?: ITrend;
}

const trendClasses: Record<ITrend["direction"], string> = {
  up: "bg-status-red/10 text-status-red",
  down: "bg-status-blue/10 text-status-blue",
};

export default function StatCard({
  title,
  value,
  trend,
  className,
  ...rest
}: IStatCardProps) {
  return (
    <div
      className={twMerge(
        "bg-white rounded-component-md border border-chart-inactive p-5 flex flex-col gap-2",
        className,
      )}
      {...rest}
    >
      <p className="font-caption text-text-sub">{title}</p>
      <p className="font-heading2 text-text-main">{value}</p>
      {trend && (
        <span
          aria-label={`${trend.value} ${trend.direction === "up" ? "상승" : "하락"}`}
          className={twMerge(
            "inline-flex items-center gap-1 px-2 py-1 rounded-full font-caption w-fit",
            trendClasses[trend.direction],
          )}
        >
          {trend.direction === "up" ? (
            <TrendUpIcon aria-hidden className="w-4 h-4" />
          ) : (
            <TrendDownIcon aria-hidden className="w-4 h-4" />
          )}
          {trend.value}
        </span>
      )}
    </div>
  );
}
