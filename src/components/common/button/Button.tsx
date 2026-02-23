import type { ButtonHTMLAttributes, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "big" | "small";
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "danger"
    | "dangerSoft"
    | "gradient"
    | "custom";
  isLoading?: boolean;
  leftIcon?: ReactNode;
  fullWidth?: boolean;
}

export default function Button({
  size = "small",
  variant = "primary",
  isLoading = false,
  disabled = false,
  leftIcon,
  fullWidth = false,
  className,
  children,
  ...rest
}: IButtonProps) {
  const sizeClasses = {
    big: "h-button-big px-6 rounded-component-md font-heading3 transition-colors duration-normal ease-out",
    small:
      "h-button-small px-4 rounded-component-sm font-body1 transition-colors duration-normal ease-out",
  };

  const variantClasses = {
    primary:
      "bg-chart-3 text-white hover:opacity-80 disabled:bg-bg-disabled disabled:text-text-disabled disabled:hover:opacity-100",
    secondary:
      "bg-gray-100 text-brand-900 hover:bg-gray-200 disabled:bg-bg-disabled disabled:text-text-disabled disabled:hover:opacity-100",
    outline:
      "bg-transparent border border-chart-3 text-chart-3 hover:bg-brand-300 disabled:border-gray-300 disabled:text-text-disabled disabled:hover:bg-transparent",
    danger:
      "bg-status-red text-white hover:opacity-80 disabled:bg-bg-disabled disabled:text-text-disabled disabled:hover:opacity-100",
    dangerSoft:
      "bg-status-red/10 text-status-red border border-status-red hover:bg-status-red/20 disabled:bg-bg-disabled disabled:text-text-disabled disabled:border-gray-300",
    gradient:
      "bg-linear-to-r from-logo-1 to-logo-2 text-white hover:opacity-90 shadow-brand-500/30 disabled:bg-bg-disabled disabled:text-text-disabled disabled:shadow-none",
    custom: "",
  };

  return (
    <button
      className={twMerge(
        "flex items-center justify-center gap-2 active-scale whitespace-nowrap",
        sizeClasses[size],
        variantClasses[variant],
        fullWidth && "w-full relative",
        (disabled || isLoading) && "opacity-50 cursor-not-allowed",
        className,
      )}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading && (
        <span className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
      )}
      {!isLoading && leftIcon && (
        <span className={twMerge(fullWidth ? "absolute left-6" : "")}>
          {leftIcon}
        </span>
      )}
      <span>{children}</span>
    </button>
  );
}
