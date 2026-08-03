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
      className="bg-surface-100 rounded-3xl shadow-tooltip w-84 overflow-hidden"
    >
      <div
        key={index}
        className="animate-tooltip-enter flex flex-col gap-4 p-6"
      >
        <div className="flex items-start justify-between gap-4">
          {step.title && (
            <h3 className="font-heading4 text-text-title whitespace-pre-line">
              {step.title}
            </h3>
          )}
          <span className="font-caption text-text-muted shrink-0 pt-1">
            {index + 1} / {size}
          </span>
        </div>

        <p className="font-body2 text-text-body leading-relaxed break-keep whitespace-pre-line">
          {step.content}
        </p>

        <div className="flex items-center justify-between pt-3 ">
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
    </div>
  );
}
