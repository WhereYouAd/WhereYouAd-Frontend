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
    | "tertiary"
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
    big: "h-14 px-6 rounded-2xl font-heading4 transition-colors duration-normal ease-out",
    small:
      "h-10 px-4 rounded-lg font-body1 transition-colors duration-normal ease-out",
  };

  const variantClasses = {
    primary:
      "bg-chart-3 text-white hover:bg-[#0e6add] disabled:bg-bg-disabled disabled:text-text-disabled disabled:hover:bg-bg-disabled",
    secondary:
      "bg-gray-100 text-brand-900 hover:bg-gray-200 disabled:bg-bg-disabled disabled:text-text-disabled disabled:hover:bg-bg-disabled",
    outline:
      "bg-transparent border border-chart-3 text-chart-3 hover:bg-chart-3/5 disabled:border-gray-300 disabled:text-text-disabled disabled:hover:bg-transparent",
    danger:
      "bg-status-red text-white hover:bg-[#d91632] disabled:bg-bg-disabled disabled:text-text-disabled disabled:hover:bg-bg-disabled",
    dangerSoft:
      "bg-status-red/10 text-status-red border border-status-red hover:bg-status-red/20 disabled:bg-bg-disabled disabled:text-text-disabled disabled:border-gray-300 disabled:hover:bg-bg-disabled",
    gradient:
      "bg-linear-to-r from-logo-1 to-logo-2 text-white hover:opacity-90 shadow-brand-500/30 disabled:bg-bg-disabled disabled:text-text-disabled disabled:shadow-none disabled:hover:opacity-50",
    tertiary:
      "!h-7 border border-gray-200 text-text-auth-sub px-5 rounded-3xl bg-white font-body2 hover:bg-gray-100 transition-colors duration-200 ease-in-out",
    custom: "",
  };

  return (
    <button
      className={twMerge(
        "flex items-center justify-center gap-2 whitespace-nowrap",
        !(disabled || isLoading) && "active-scale",
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
      {children}
    </button>
  );
}
