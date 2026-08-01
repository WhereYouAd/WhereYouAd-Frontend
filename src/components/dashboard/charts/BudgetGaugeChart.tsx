import { memo } from "react";
import { twMerge } from "tailwind-merge";

import type { IBudgetGaugeProps } from "@/types/dashboard/budget";

import {
  getRemainingPercentage,
  getSpentPercentage,
} from "@/utils/dashboard/budget";
import { METRIC_REGISTRY as M } from "@/utils/dashboard/metricRegistry";

import { useIsMounted } from "@/hooks/common/useIsMounted";

import Badge, { type TBadgeVariant } from "@/components/common/badge/Badge";

import WarnCircleIcon from "@/assets/icon/common/warn-circle.svg?react";

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
  안정: "infoBlue",
  주의: "infoYellow",
  위험: "infoRed",
};

const statusPointClasses: Record<TBudgetStatus, string> = {
  안정: "bg-info-blue",
  주의: "bg-info-yellow",
  위험: "bg-info-red",
};

function splitInsightHeadTail(text: string): { head: string; tail?: string } {
  const trimmed = text.trim();
  const m = /^(.+?\.)(\s+)(.+)$/s.exec(trimmed);
  if (!m) return { head: trimmed };
  return { head: m[1], tail: m[3].trim() };
}

const BudgetGaugeChart = memo(function BudgetGaugeChart({
  label,
  totalBudget,
  spent,
  warningThreshold,
  dangerThreshold,
  compact = false,
  showInsight = false,
}: IBudgetGaugeProps) {
  const mounted = useIsMounted();

  const slice = { totalBudget, spent };
  const spentPct = getSpentPercentage(slice);
  const remainingPct = getRemainingPercentage(slice);
  const isOverBudget = spent > totalBudget;
  const remainingAmount = isOverBudget
    ? spent - totalBudget
    : totalBudget - spent;

  const status = getBudgetStatus(spentPct, warningThreshold, dangerThreshold);

  let insightDesc = "";

  if (isOverBudget) {
    insightDesc = "예산을 초과했습니다. 캠페인 조정이 필요해요.";
  } else if (spentPct >= dangerThreshold) {
    insightDesc = "예산 소진이 빨라요. 일일 한도 점검을 추천해요.";
  } else if (spentPct >= warningThreshold) {
    insightDesc = "예산 소진 속도가 다소 높아요. 매체 효율을 확인해 보세요.";
  } else {
    insightDesc = "계획된 예산 범위 내에서 잘 사용되고 있어요.";
  }

  const { head: insightHead, tail: insightTail } =
    splitInsightHeadTail(insightDesc);

  return (
    <div
      className={twMerge(
        "flex h-full w-full flex-col",
        compact ? "pt-0" : "pt-4",
      )}
    >
      <div className={twMerge("flex flex-col", compact ? "mb-3" : "mb-6")}>
        <div
          className={twMerge(
            "flex items-center justify-between gap-2",
            compact ? "mb-2" : "mb-3",
          )}
        >
          <h3 className="font-body2 text-text-body">{label}</h3>
          <Badge variant={statusBadgeVariant[status]} className="shrink-0 px-2">
            {status}
          </Badge>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-heading1 text-text-title tabular-nums leading-none">
            {remainingPct}%
          </span>
          <span className="font-body2 text-text-body tabular-nums">남음</span>
        </div>
      </div>

      <div className={twMerge("relative w-full", compact ? "mb-3" : "mb-6")}>
        <div
          role="progressbar"
          aria-label={`${label} 남은 비율`}
          aria-valuenow={remainingPct}
          aria-valuemin={0}
          aria-valuemax={100}
          className="relative h-3 w-full overflow-hidden rounded-full bg-surface-200"
        >
          <div
            className="absolute top-0 bottom-0 z-10 w-0.5 bg-surface-100/60"
            style={{ left: `${100 - dangerThreshold}%` }}
          />
          <div
            className="absolute top-0 bottom-0 z-10 w-0.5 bg-surface-100/60"
            style={{ left: `${100 - warningThreshold}%` }}
          />

          <div
            className={twMerge(
              "absolute top-0 left-0 h-full w-full origin-left rounded-full transition-transform duration-1000 ease-smooth",
              statusPointClasses[status],
            )}
            style={{
              transform: `scaleX(${mounted ? remainingPct / 100 : 0})`,
            }}
          />
        </div>

        <div
          className={twMerge(
            "flex items-end justify-between",
            compact ? "mt-2" : "mt-3",
          )}
        >
          <div className="flex flex-col gap-0.5">
            <span className="font-caption text-text-muted">사용</span>
            <span className="font-body2 text-text-body tabular-nums">
              {M.spend.format(spent)}
            </span>
          </div>
          <div className="flex flex-col items-end gap-0.5">
            <span className="font-caption text-text-muted">전체</span>
            <span className="font-body2 text-text-body tabular-nums">
              {M.spend.format(totalBudget)}
            </span>
          </div>
        </div>
      </div>

      <div
        className={twMerge("flex flex-1 flex-col", compact ? "gap-2" : "gap-3")}
      >
        <div
          className={twMerge(
            "flex flex-col gap-1 rounded-2xl border border-surface-400/25 bg-surface-200/50",
            compact ? "px-4 py-3" : "p-4",
          )}
        >
          <span className="font-caption text-text-muted">남은 예산</span>
          <span
            className={twMerge(
              "font-heading3 text-text-title tabular-nums",
              isOverBudget && "text-info-red",
            )}
          >
            {isOverBudget ? "-" : ""}
            {M.spend.format(remainingAmount)}
          </span>
        </div>

        {showInsight && (
          <div className="flex items-center gap-3 rounded-2xl bg-surface-300 px-5 py-4">
            <WarnCircleIcon
              className="block size-5 shrink-0 text-text-muted"
              aria-hidden="true"
            />
            <p className="m-0 min-w-0 flex-1 break-keep font-body2 text-text-body">
              <span>{insightHead}</span>
              {insightTail ? (
                <span className="mt-0.5 block tablet:ml-1 tablet:mt-0 tablet:inline">
                  {insightTail}
                </span>
              ) : null}
            </p>
          </div>
        )}
      </div>
    </div>
  );
});

export default BudgetGaugeChart;
