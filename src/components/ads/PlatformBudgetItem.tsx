import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

import type { IBudgetGaugeProps } from "@/types/dashboard/budget";

import { getRemainingPercentage } from "@/utils/dashboard/budget";
import { METRIC_REGISTRY as M } from "@/utils/dashboard/metricRegistry";

import { useIsMounted } from "@/hooks/common/useIsMounted";

interface IPlatformBudgetItemProps extends Pick<
  IBudgetGaugeProps,
  "label" | "totalBudget" | "spent"
> {
  headerAction?: ReactNode;
}

export default function PlatformBudgetItem({
  label,
  totalBudget,
  spent,
  headerAction,
}: IPlatformBudgetItemProps) {
  const mounted = useIsMounted();

  const slice = { totalBudget, spent };
  const remainingPct = getRemainingPercentage(slice);
  const isOverBudget = spent > totalBudget;
  const remainingAmount = isOverBudget
    ? spent - totalBudget
    : totalBudget - spent;

  return (
    <article
      className={twMerge(
        "flex min-w-0 flex-col rounded-xl border border-surface-400/70 bg-surface-100 px-4 py-4",
        headerAction ? "gap-2" : "gap-3",
      )}
      aria-label={`${label} 예산`}
    >
      <div
        className={twMerge(
          "flex min-w-0 justify-between gap-3",
          headerAction ? "items-center" : "items-start",
        )}
      >
        <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
          <span className="font-body2 text-text-placeholder">{label}</span>
          <div className="flex items-baseline gap-2">
            <span className="font-heading4 text-text-title tabular-nums leading-none">
              {remainingPct}%
            </span>
            <span className="font-body2 text-text-body tabular-nums">남음</span>
          </div>
        </div>
        {headerAction ? <div className="shrink-0">{headerAction}</div> : null}
      </div>

      <div
        role="progressbar"
        aria-label={`${label} 남은 비율`}
        aria-valuenow={remainingPct}
        aria-valuemin={0}
        aria-valuemax={100}
        className="relative h-2.5 w-full overflow-hidden rounded-full bg-surface-200"
      >
        <div
          className="absolute top-0 left-0 h-full w-full origin-left rounded-full bg-info-blue transition-transform duration-700 ease-smooth"
          style={{
            transform: `scaleX(${mounted ? remainingPct / 100 : 0})`,
          }}
        />
      </div>

      <div className="flex items-baseline justify-between gap-3">
        <span
          className={twMerge(
            "font-body2 text-text-body tabular-nums",
            isOverBudget && "text-info-red",
          )}
        >
          {M.spend.format(remainingAmount)}
        </span>
        <span
          className={twMerge(
            "font-body2 text-text-body tabular-nums",
            isOverBudget && "text-info-red",
          )}
        >
          {M.spend.format(totalBudget)}
        </span>
      </div>
    </article>
  );
}
