import type { TooltipRenderProps } from "react-joyride";

import Button from "@/components/common/button/Button";

export default function OnboardingTooltip({
  continuous,
  index,
  size,
  step,
  isLastStep,
  backProps,
  primaryProps,
  skipProps,
  tooltipProps,
}: TooltipRenderProps) {
  return (
    <div
      {...tooltipProps}
      className="bg-surface-100 rounded-3xl shadow-Soft p-6 w-80 flex flex-col gap-5"
    >
      <div className="flex items-start justify-between gap-4">
        <p className="font-body2 text-text-body leading-relaxed flex-1">
          {step.content}
        </p>
        <span className="font-caption text-text-muted shrink-0 pt-0.5">
          {index + 1} / {size}
        </span>
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-surface-300">
        {!isLastStep ? (
          <button
            {...skipProps}
            className="font-body2 text-text-muted hover:text-text-body transition-colors duration-150"
          >
            건너뛰기
          </button>
        ) : (
          <span />
        )}

        <div className="flex items-center gap-2">
          {index > 0 && (
            <Button {...backProps} size="small" variant="outline">
              이전
            </Button>
          )}
          {continuous && (
            <Button {...primaryProps} size="small" variant="primary">
              {isLastStep ? "완료" : "다음"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
