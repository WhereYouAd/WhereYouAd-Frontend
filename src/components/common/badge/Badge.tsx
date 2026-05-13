import type { HTMLAttributes, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

/** 토큰 색 기준 (`info-*`, `surface`) */
export type TBadgeVariant = "infoYellow" | "infoBlue" | "infoRed" | "surface";

interface IBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: TBadgeVariant;
  leftIcon?: ReactNode;
}

const badgeSizeClass = "h-7 px-3 py-1 font-caption";

export default function Badge({
  variant = "infoBlue",
  leftIcon,
  className,
  children,
  ...rest
}: IBadgeProps) {
  const variantClasses: Record<TBadgeVariant, string> = {
    infoYellow:
      "bg-info-yellow/20 text-info-yellow border border-info-yellow/50",
    infoBlue: "bg-info-blue/15 text-info-blue border border-info-blue/40",
    infoRed: "bg-info-red/15 text-info-red border border-info-red/40",
    /* 중립 배지 */
    surface: "bg-surface-200 text-text-muted border border-text-placeholder/40",
  };

  return (
    <span
      role="status"
      className={twMerge(
        "inline-flex items-center gap-2 rounded-full whitespace-nowrap",
        badgeSizeClass,
        variantClasses[variant],
        className,
      )}
      {...rest}
    >
      {leftIcon ? <span className="shrink-0">{leftIcon}</span> : null}
      <span className="leading-none">{children}</span>
    </span>
  );
}
