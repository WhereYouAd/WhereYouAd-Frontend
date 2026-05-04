import { memo } from "react";
import { twMerge } from "tailwind-merge";

import { useIsMounted } from "@/hooks/common/useIsMounted";

import { type TBadgeVariant } from "@/components/common/badge/Badge";

import WarnCircleIcon from "@/assets/icon/common/warn-circle.svg?react";

interface IBudgetGaugeChartProps {
  totalBudget: number;
  spent: number;
  warningThreshold: number;
  dangerThreshold: number;
  /** 카드가 세로로 늘어날 때 게이지와 인사이트 사이를 채워 인사이트를 하단에 붙임(compact와 함께 사용 가능) */
  fillColumn?: boolean;
  /** 통합 대시보드 우측 등 좁은 카드용 — 여백·타이포 축소 */
  compact?: boolean;
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

const BudgetGaugeChart = memo(function BudgetGaugeChart({
  totalBudget,
  spent,
  warningThreshold,
  dangerThreshold,
  fillColumn = false,
  compact = false,
}: IBudgetGaugeChartProps) {
  const mounted = useIsMounted();

  const percentage =
    totalBudget > 0 ? Math.round((spent / totalBudget) * 100) : 0;
  const isOverBudget = spent > totalBudget;
  const overAmount = isOverBudget ? spent - totalBudget : 0;
  const remaining = isOverBudget ? 0 : totalBudget - spent;

  const status = getBudgetStatus(percentage, warningThreshold, dangerThreshold);

  const progressAriaValueText = isOverBudget
    ? `${percentage}% 소진, 예산 한도 초과`
    : `${percentage}% 소진`;

  let insightDesc = "";

  if (isOverBudget) {
    insightDesc = "예산을 초과했습니다. 캠페인 조정이 필요해요.";
  } else if (percentage >= dangerThreshold) {
    insightDesc = "예산 소진이 빨라요. 일일 한도 점검을 추천해요.";
  } else if (percentage >= warningThreshold) {
    insightDesc = "예산 소진 속도가 다소 높아요. 매체 효율을 확인해 보세요.";
  } else {
    insightDesc = "계획된 예산 범위 내에서 잘 사용되고 있어요.";
  }

  const secondaryLabel = isOverBudget ? "예산 초과액" : "남은 예산";
  const secondaryAmount = isOverBudget ? overAmount : remaining;

  return (
    <div
      className={twMerge(
        "flex w-full flex-col font-pretendard",
        compact ? "gap-2 pt-0" : "gap-4 pt-1",
        fillColumn && "h-full min-h-0 flex-1",
      )}
    >
      <div
        className={twMerge(
          "flex shrink-0 flex-col",
          compact ? "gap-2" : "gap-3",
        )}
      >
        <div className={twMerge("flex flex-col", compact ? "gap-0" : "gap-1")}>
          <h3 className="font-caption font-semibold tracking-wide text-text-placeholder">
            사용 예산
          </h3>
          <div className="flex items-baseline gap-1.5">
            <span
              className={twMerge(
                "font-extrabold tracking-tight tabular-nums leading-none text-text-main",
                compact ? "font-heading3" : "font-heading2",
              )}
            >
              {percentage}%
            </span>
            <span
              className={twMerge(
                "font-semibold tabular-nums text-text-sub",
                compact ? "font-caption" : "font-body2",
              )}
            >
              소진
            </span>
          </div>
        </div>

        <div className="relative w-full">
          <div
            role="progressbar"
            aria-label="전체 예산 소진율"
            aria-valuenow={Math.min(Math.max(percentage, 0), 100)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuetext={progressAriaValueText}
            className={twMerge(
              "relative w-full overflow-hidden rounded-full bg-bg-disabled/35",
              compact ? "h-2" : "h-2.5",
            )}
          >
            <div
              className="absolute top-0 bottom-0 z-10 w-px bg-white/70"
              style={{ left: `${warningThreshold}%` }}
            />
            <div
              className="absolute top-0 bottom-0 z-10 w-px bg-white/70"
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

          <div
            className={twMerge(
              "flex justify-between gap-3",
              compact ? "mt-1.5" : "mt-2",
            )}
          >
            <div className="flex min-w-0 flex-col gap-0.5">
              <span className="font-caption text-text-placeholder">소진액</span>
              <span
                className={twMerge(
                  "tabular-nums text-text-sub",
                  compact ? "font-caption font-semibold" : "font-body2",
                )}
              >
                ₩{spent.toLocaleString()}
              </span>
            </div>
            <div className="flex min-w-0 flex-col items-end gap-0.5 text-right">
              <span className="font-caption text-text-placeholder">
                예산 한도
              </span>
              <span
                className={twMerge(
                  "tabular-nums text-text-sub",
                  compact ? "font-caption font-semibold" : "font-body2",
                )}
              >
                ₩{totalBudget.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {fillColumn ? (
        <div className="min-h-0 flex-1 basis-0 shrink" aria-hidden />
      ) : null}

      <div
        className={twMerge(
          "flex shrink-0 flex-col rounded-lg border border-bg-disabled/25 bg-bg-surface/60",
          compact ? "gap-1.5 p-2.5" : "gap-2 rounded-xl p-3",
        )}
      >
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="font-caption font-medium text-text-placeholder">
            {secondaryLabel}
          </span>
          <span
            className={twMerge(
              "font-bold tracking-tight tabular-nums leading-tight",
              compact ? "font-body1" : "font-heading4",
              isOverBudget ? "text-status-red" : "text-text-main",
            )}
          >
            ₩{secondaryAmount.toLocaleString()}
          </span>
        </div>

        <div
          className={twMerge(
            "flex min-w-0 items-start gap-2 border-t border-bg-disabled/40",
            compact ? "pt-1.5" : "pt-2",
          )}
        >
          <WarnCircleIcon
            className={twMerge(
              "mt-0.5 shrink-0 text-text-placeholder",
              compact ? "h-3.5 w-3.5" : "h-4 w-4",
            )}
            aria-hidden="true"
          />
          <p
            className={twMerge(
              "font-medium leading-relaxed text-text-sub break-keep",
              compact
                ? "text-[11px] leading-snug"
                : "font-caption leading-relaxed",
            )}
          >
            {insightDesc}
          </p>
        </div>
      </div>
    </div>
  );
});

export default BudgetGaugeChart;
