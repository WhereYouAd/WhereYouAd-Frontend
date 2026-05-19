import type { HTMLAttributes } from "react";
import { memo } from "react";
import { twMerge } from "tailwind-merge";

import TrendDownIcon from "@/assets/icon/chevron/trend-down.svg?react";
import TrendUpIcon from "@/assets/icon/chevron/trend-up.svg?react";

export interface ITrend {
  direction: "up" | "down";
  value: string;
}

export interface IStatCardProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  trend?: ITrend;
  /** 수치·트렌드 배지를 기본보다 한 단계 작게 (제목은 동일) */
  compact?: boolean;
}

const trendClasses: Record<ITrend["direction"], string> = {
  up: "bg-info-red/[0.08] text-info-red",
  down: "bg-info-blue/[0.08] text-info-blue",
};

export const TrendBadge = memo(function TrendBadge({
  direction,
  value,
  compact = false,
}: ITrend & { compact?: boolean }) {
  return (
    <span
      aria-label={`${value} ${direction === "up" ? "상승" : "하락"}`}
      className={twMerge(
        "inline-flex items-center rounded-full w-fit",
        compact
          ? "gap-0.5 px-2 py-0.5 font-caption"
          : "gap-1 px-2 py-1 font-caption",
        trendClasses[direction],
      )}
    >
      {direction === "up" ? (
        <TrendUpIcon
          aria-hidden
          className={compact ? "h-3.5 w-3.5 shrink-0" : "h-4 w-4"}
        />
      ) : (
        <TrendDownIcon
          aria-hidden
          className={compact ? "h-3.5 w-3.5 shrink-0" : "h-4 w-4"}
        />
      )}
      {value}
    </span>
  );
});

const StatCard = memo(function StatCard({
  title,
  value,
  trend,
  className,
  compact = false,
  ...rest
}: IStatCardProps) {
  return (
    <div
      className={twMerge(
        "bg-surface-100/80 backdrop-blur-sm rounded-3xl shadow-Soft p-7 flex flex-col gap-4 border border-surface-100/40",
        className,
      )}
      {...rest}
    >
      <p className="font-body2 text-text-muted">{title}</p>
      <p
        className={twMerge(
          "text-text-title tracking-tight",
          compact ? "font-heading2" : "font-heading1",
        )}
      >
        {value}
      </p>
      {trend && <TrendBadge {...trend} compact={compact} />}
    </div>
  );
});

export default StatCard;
