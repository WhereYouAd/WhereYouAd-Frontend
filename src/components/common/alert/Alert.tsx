import type { HTMLAttributes, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export type TAlertVariant = "info" | "success" | "warning" | "danger";

export interface IAlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: TAlertVariant;
  title?: string;
  icon?: ReactNode;
}

export default function Alert({
  variant = "info",
  title,
  icon,
  className,
  children,
  ...rest
}: IAlertProps) {
  const base = "w-full rounded-component-lg px-5 py-4";

  const variantClasses: Record<TAlertVariant, string> = {
    info: "text-brand-700",
    success: "text-status-blue",
    warning: "text-status-yellow",
    danger: "text-status-red",
  };

  return (
    <div
      className={twMerge(base, variantClasses[variant], className)}
      {...rest}
    >
      <div className="flex items-start gap-3">
        {icon && <div className="mt-0.5 shrink-0">{icon}</div>}
        <div className="min-w-0">
          {title && <div className="font-body1 mb-1">{title}</div>}
          <div className="font-body2 text-text-main">{children}</div>
        </div>
      </div>
    </div>
  );
}
