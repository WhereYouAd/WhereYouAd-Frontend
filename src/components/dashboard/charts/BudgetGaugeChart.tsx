import { twMerge } from "tailwind-merge";

import { useIsMounted } from "@/hooks/common/useIsMounted";

import { type TBadgeVariant } from "@/components/common/badge/Badge";

import AlertCircleIcon from "@/assets/icon/common/alert-circle.svg?react";

interface IBudgetGaugeChartProps {
  totalBudget: number;
  spent: number;
  warningThreshold: number;
  dangerThreshold: number;
}

export type TBudgetStatus = "안정" | "주의" | "위험";

export function getBudgetStatus(
  percentage: number,
  warningThreshold: number,
  dangerThreshold: number,
): TBudgetStatus {
  if (percentage >= dangerThreshold) return "위험";
  if (percentage >= warningThreshold) return "주의";
  return "안정";
}

export const statusBadgeVariant: Record<TBudgetStatus, TBadgeVariant> = {
  안정: "success",
  주의: "syncing",
  위험: "inactive",
};

const statusPointClasses: Record<TBudgetStatus, string> = {
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
  const mounted = useIsMounted();

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

  const status = getBudgetStatus(percentage, warningThreshold, dangerThreshold);

  // 데이터 인사이트 메시지
  let insightDesc = "";

  if (isOverBudget) {
    insightDesc = "예산을 초과했습니다. 캠페인 조정이 필요해요.";
  } else if (
    percentage >= dangerThreshold ||
    percentage > periodElapsedRate + 15
  ) {
    insightDesc = "예산 소진이 빨라요. 일일 한도 점검을 추천해요.";
  } else if (
    percentage >= warningThreshold ||
    percentage > periodElapsedRate + 5
  ) {
    insightDesc = "예산 소진 속도가 다소 높아요. 매체 효율을 확인해 보세요.";
  } else if (percentage < periodElapsedRate - 5) {
    insightDesc = "예산이 여유로워요. 효율이 좋은 매체에 더 투자해 보세요.";
  } else {
    insightDesc = "계획된 일정에 맞게 예산이 잘 사용되고 있어요.";
  }

  return (
    <div className="flex flex-col w-full h-full font-pretendard pt-6">
      <div className="flex flex-col mb-8">
        <div className="flex items-center mb-3">
          <span className="font-body2 font-semibold text-text-auth-sub">
            이번 달 사용 예산
          </span>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="font-heading1 font-extrabold text-text-main tracking-tight leading-none tabular-nums">
            {percentage}%
          </span>
          <span className="font-body2 font-bold text-text-sub tracking-tight tabular-nums">
            소진
          </span>
        </div>
      </div>

      <div className="relative mb-10 w-full">
        <div
          role="progressbar"
          aria-valuenow={Math.min(Math.max(percentage, 0), 100)}
          aria-valuemin={0}
          aria-valuemax={100}
          className="relative h-3 w-full bg-bg-surface rounded-full overflow-hidden"
        >
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-white/60 z-10"
            style={{ left: `${warningThreshold}%` }}
          />
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-white/60 z-10"
            style={{ left: `${dangerThreshold}%` }}
          />

          <div
            className={twMerge(
              "absolute top-0 left-0 h-full w-full rounded-full transition-transform duration-1000 ease-smooth origin-left",
              statusPointClasses[status],
            )}
            style={{
              transform: `scaleX(${mounted ? Math.min(percentage, 100) / 100 : 0})`,
            }}
          />
        </div>

        <div className="flex justify-between items-center mt-3 font-body2 text-text-sub">
          <span className="tabular-nums">₩{spent.toLocaleString()}</span>
          <span className="tabular-nums">₩{totalBudget.toLocaleString()}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <div className="flex flex-col gap-1.5 p-4 rounded-2xl bg-bg-surface/50">
          <span className="font-caption font-medium text-text-auth-sub">
            남은 예산
          </span>
          <span
            className={twMerge(
              "font-body1 font-bold tracking-tight tabular-nums",
              isOverBudget ? "text-status-red" : "text-text-main",
            )}
          >
            {isOverBudget ? "-" : ""}₩{remaining.toLocaleString()}
          </span>
        </div>

        <div className="flex flex-col gap-1 p-4 rounded-2xl bg-bg-surface/50">
          <div className="flex items-center justify-between">
            <span className="font-caption font-medium text-text-auth-sub">
              기간 진행률
            </span>
            <span className="font-caption font-semibold text-text-sub tabular-nums">
              {periodElapsedRate}%
            </span>
          </div>
          <span className="font-body1 font-bold text-text-main tabular-nums text-right mt-0.5">
            {periodElapsedDays}일
            <span className="font-caption font-medium text-text-auth-sub">
              {" "}
              / {periodTotalDays}일
            </span>
          </span>
        </div>
      </div>

      <div className="mt-auto px-5 py-4 flex items-center gap-3 rounded-[16px] bg-[#F2F4F6]">
        <AlertCircleIcon
          className="w-5 h-5 text-[#8B95A1] shrink-0"
          aria-hidden="true"
        />
        <p className="font-body2 text-[#4E5968] font-medium leading-snug break-keep">
          {insightDesc}
        </p>
      </div>
    </div>
  );
}
