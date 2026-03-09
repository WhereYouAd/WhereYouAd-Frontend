import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

interface IBudgetGaugeChartProps {
  totalBudget: number;
  spent: number;
  warningThreshold: number;
  dangerThreshold: number;
}

const statusBadgeClasses: Record<string, string> = {
  안정: "bg-status-green/[0.08] text-status-green",
  주의: "bg-status-yellow/[0.08] text-status-yellow",
  위험: "bg-status-red/[0.08] text-status-red",
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

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="flex flex-col w-full h-full justify-between font-pretendard">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-1">
            <span className="font-heading1 text-text-main font-extrabold tracking-tight leading-none">
              {percentage}%
            </span>
            <span className="font-caption text-text-sub font-semibold">
              소진
            </span>
          </div>

          <span
            className={twMerge(
              "inline-flex items-center px-2.5 py-1 rounded-full font-caption font-bold tracking-tight",
              statusBadgeClasses[status],
            )}
          >
            {status}
          </span>
        </div>

        <div className="relative py-1.5">
          <div
            role="progressbar"
            aria-valuenow={Math.min(Math.max(percentage, 0), 100)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="예산 소진율"
            aria-valuetext={
              percentage > 100
                ? `예산 소진율 ${percentage}%, 예산을 초과했습니다`
                : `예산 소진율 ${Math.max(percentage, 0)}%`
            }
            className="relative h-3 w-full bg-bg-disabled/40 rounded-full overflow-hidden shadow-[inset_0_1px_3px_rgba(0,0,0,0.08)]"
          >
            <div
              className={twMerge(
                "absolute top-0 left-0 h-full w-full rounded-full transition-transform duration-1000 ease-out origin-left",
                status === "안정"
                  ? "bg-linear-to-r from-status-green/50 to-status-green"
                  : status === "주의"
                    ? "bg-linear-to-r from-status-yellow/50 to-status-yellow"
                    : "bg-linear-to-r from-status-red/50 to-status-red",
              )}
              style={{
                transform: `scaleX(${mounted ? Math.min(percentage, 100) / 100 : 0})`,
              }}
            >
              <div className="absolute inset-0 rounded-full bg-linear-to-b from-white/30 to-transparent" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 py-5 border-y border-bg-surface mb-6">
        <div className="flex justify-between items-center">
          <span className="font-body2 text-text-sub">총 목표 예산</span>
          <span className="font-body2 text-text-main tracking-tight">
            ₩{totalBudget.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-body2 text-text-sub font-medium opacity-80">
            현재 사용액
          </span>
          <span className="font-body2 text-text-main font-bold font-mono tracking-tight">
            ₩{spent.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-body2 text-text-sub">기간 진행률</span>
          <span className="font-body2 text-text-main tracking-tight">
            {periodElapsedDays}/{periodTotalDays}일{" "}
            <span className="text-text-sub font-medium">
              ({periodElapsedRate}%)
            </span>
          </span>
        </div>
      </div>

      <div className="bg-bg-surface/40 rounded-component-lg p-6 flex flex-col gap-4 border border-white/40 mt-auto">
        <div className="flex flex-col gap-1">
          <span className="font-caption text-text-sub">
            {isOverBudget ? "초과 지출" : "이번 달 잔액"}
          </span>
          <span
            className={twMerge(
              "font-heading2 font-extrabold tracking-tight leading-none pt-1",
              isOverBudget ? "text-status-red" : "text-text-main",
            )}
          >
            ₩{remaining.toLocaleString()}
          </span>
        </div>

        <div className="h-px bg-white/60 w-full" />

        <div className="flex items-start gap-1.5">
          <div
            className={twMerge(
              "w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 motion-safe:animate-pulse",
              statusPointClasses[status],
            )}
          />
          <p className="font-caption text-text-sub leading-relaxed">
            기간의 {periodElapsedRate}%가 경과했으며, 예산은{" "}
            <span
              className={twMerge(
                "font-bold",
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
    </div>
  );
}
