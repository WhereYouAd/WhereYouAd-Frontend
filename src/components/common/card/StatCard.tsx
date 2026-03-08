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
  up: "bg-status-red/[0.08] text-status-red font-bold",
  down: "bg-status-blue/[0.08] text-status-blue font-bold",
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
        "bg-white/80 backdrop-blur-sm rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-7 flex flex-col gap-4 border border-white/40 transition-all duration-300 hover:shadow-[0_12px_40px_rgba(33,130,246,0.08)]",
        className,
      )}
      {...rest}
    >
      <p className="font-body2 text-text-sub font-medium">{title}</p>
      <p className="font-heading1 text-text-main font-extrabold tracking-tight">
        {value}
      </p>
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
