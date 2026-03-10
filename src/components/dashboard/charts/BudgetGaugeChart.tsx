import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

import Badge, { type TBadgeVariant } from "@/components/common/badge/Badge";

interface IBudgetGaugeChartProps {
  totalBudget: number;
  spent: number;
  warningThreshold: number;
  dangerThreshold: number;
}

const statusBadgeVariant: Record<string, TBadgeVariant> = {
  안정: "success",
  주의: "syncing",
  위험: "inactive", // or warning/error if defined, but staying with original "inactive"
};

const statusPointClasses: Record<string, string> = {
  안정: "bg-status-green",
  주의: "bg-status-yellow",
  위험: "bg-status-red",
};

export default function BudgetGaugeChart({
  totalBudget,
  spent,
  warningThreshold,
  dangerThreshold,
}: IBudgetGaugeChartProps) {
  const [mounted, setMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const percentage =
    totalBudget > 0 ? Math.round((spent / totalBudget) * 100) : 0;
  const isOverBudget = spent > totalBudget;
  const remaining = isOverBudget ? spent - totalBudget : totalBudget - spent;

  const now = new Date();
  const periodElapsedDays = now.getDate();
  const periodTotalDays = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
  ).getDate();
  const periodElapsedRate = Math.round(
    (periodElapsedDays / periodTotalDays) * 100,
  );

  const getStatus = () => {
    if (percentage >= dangerThreshold) return "위험";
    if (percentage >= warningThreshold) return "주의";
    return "안정";
  };

  const status = getStatus();

  return (
    <div className="flex flex-col w-full h-full font-pretendard">
      {/* Header Section */}
      <div className="flex flex-col mb-10 mt-5">
        <div className="flex items-start justify-between mb-5">
          <div className="flex flex-col gap-1.5">
            <span className="font-body2 text-text-auth-sub">현재 사용액</span>
            <div className="flex flex-wrap items-end gap-x-2 gap-y-1">
              <span className="font-heading1 text-text-main tracking-tight leading-none">
                ₩{spent.toLocaleString()}
              </span>
              <span className="font-body2 text-text-sub whitespace-nowrap pb-0.5">
                / ₩{totalBudget.toLocaleString()}
              </span>
            </div>
          </div>
          <Badge
            variant={statusBadgeVariant[status]}
            size="sm"
            className="absolute top-7 right-7"
          >
            {status}
          </Badge>
        </div>

        {/* Progress Bar with Tooltip */}
        <div
          className="relative pt-6 pb-2 cursor-pointer"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Tooltip */}
          <div
            className={twMerge(
              "absolute top-0 left-0 transform -translate-x-1/2 bg-neutral-800 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-semibold py-1.5 px-3 rounded-md shadow-md transition-all duration-300 z-10 whitespace-nowrap pointer-events-none",
              isHovered
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-1",
            )}
            style={{ left: `${Math.min(Math.max(percentage, 5), 95)}%` }}
          >
            {percentage}% 소진
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-neutral-800 dark:border-t-neutral-100" />
          </div>

          <div
            role="progressbar"
            aria-valuenow={Math.min(Math.max(percentage, 0), 100)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="예산 소진율"
            className="relative h-2.5 w-full bg-bg-surface/60 rounded-full overflow-hidden"
          >
            <div
              className={twMerge(
                "absolute top-0 left-0 h-full w-full rounded-full transition-transform duration-1000 ease-out origin-left",
                status === "안정"
                  ? "bg-linear-to-r from-status-green/70 to-status-green"
                  : status === "주의"
                    ? "bg-linear-to-r from-status-yellow/70 to-status-yellow"
                    : "bg-linear-to-r from-status-red/70 to-status-red",
              )}
              style={{
                transform: `scaleX(${mounted ? Math.min(percentage, 100) / 100 : 0})`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-6 mb-8 mt-2">
        <div className="flex flex-col gap-1.5 border-l-2 border-bg-surface pl-4">
          <span className="font-caption text-text-sub text-xs">
            {isOverBudget ? "초과 지출" : "이번 달 잔액"}
          </span>
          <span
            className={twMerge(
              "font-semibold text-xl tracking-tight leading-none",
              isOverBudget ? "text-status-red" : "text-text-main",
            )}
          >
            {isOverBudget ? "-" : ""}₩{remaining.toLocaleString()}
          </span>
        </div>

        <div className="flex flex-col gap-1.5 border-l-2 border-bg-surface pl-4">
          <span className="font-caption text-text-sub text-xs">
            기간 진행률 ({periodElapsedRate}%)
          </span>
          <span className="font-semibold text-xl text-text-main tracking-tight leading-none">
            {periodElapsedDays}일{" "}
            <span className="text-text-sub font-normal text-[15px]">
              / {periodTotalDays}일
            </span>
          </span>
        </div>
      </div>

      {/* Footer Message */}
      <div className="mt-auto bg-bg-surface/30 hover:bg-bg-surface/50 transition-colors rounded-xl p-4.5 flex items-start gap-3 border border-transparent hover:border-bg-surface/60">
        <div
          className={twMerge(
            "w-2 h-2 rounded-full mt-1.25 shrink-0 shadow-[0_0_8px_rgba(0,0,0,0.15)]",
            statusPointClasses[status],
            "motion-safe:animate-pulse",
          )}
        />
        <p className="font-caption text-sm text-text-sub leading-relaxed tracking-tight">
          기간의{" "}
          <span className="font-semibold text-text-main">
            {periodElapsedRate}%
          </span>
          가 경과했으며, 예산은{" "}
          <span
            className={twMerge(
              "font-semibold",
              status === "위험"
                ? "text-status-red"
                : status === "주의"
                  ? "text-status-yellow"
                  : "text-status-green",
            )}
          >
            {status}
          </span>{" "}
          수준으로 운용되고 있습니다.
        </p>
      </div>
    </div>
  );
}
