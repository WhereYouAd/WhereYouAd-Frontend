import type { HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

interface IProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
}

export default function ProgressBar({
  value,
  className,
  ...rest
}: IProgressBarProps) {
  const progress = Math.min(Math.max(value, 0), 100);

  return (
    <div
      className={twMerge("flex items-center gap-3 w-full", className)}
      {...rest}
    >
      {/* 바 전체 */}
      <div className="h-3 flex-1 rounded-full bg-bg-disabled overflow-hidden relative shrink-0">
        {/* 진행률 바 */}
        <div
          className="h-full bg-chart-3 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      {/* 퍼센트 텍스트 */}
      <span className="font-body1 shrink-0 w-11 text-text-sub min-w-8 text-right">
        {progress}%
      </span>
    </div>
  );
}
