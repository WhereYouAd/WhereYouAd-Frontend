import type { HTMLAttributes, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type TBadgeVariant = "syncing" | "success" | "inactive" | "running" | "stopped";

type TBadgeSize = "sm" | "md";

interface IBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: TBadgeVariant;
  size?: TBadgeSize;
  leftIcon?: ReactNode;
}

export default function Badge({
  variant = "success",
  size = "md",
  leftIcon,
  className,
  children,
  ...rest
}: IBadgeProps) {
  const sizeClasses: Record<TBadgeSize, string> = {
    sm: "h-7 px-3 py-1 font-caption",
    md: "h-9 px-4 py-1 font-body2",
  };

  const variantClasses: Record<TBadgeVariant, string> = {
    syncing:
      "bg-status-yellow/30 text-status-yellow border border-status-yellow",
    success: "bg-status-green/30 text-status-green border border-status-green",
    inactive: "bg-status-red/30 text-status-red border border-status-red/40",
    running: "bg-status-blue/30 text-status-blue border border-status-blue/40",
    stopped: "bg-brand-300 text-text-sub border border-text-placeholder/40",
  };

  return (
    <span
      role="status"
      className={twMerge(
        "inline-flex items-center gap-2 rounded-full whitespace-nowrap",
        sizeClasses[size],
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
