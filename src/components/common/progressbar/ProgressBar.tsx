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
      <div className="relative h-3 shrink-0 flex-1 overflow-hidden rounded-full bg-surface-300">
        {/* 진행률 바 */}
        <div
          className="h-full bg-primary-400 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      {/* 퍼센트 텍스트 */}
      <span className="min-w-8 w-11 shrink-0 text-right font-body1 text-text-muted">
        {progress}%
      </span>
    </div>
  );
}
