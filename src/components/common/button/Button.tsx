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
    big: "h-14 px-6 rounded-2xl font-heading4 transition-button",
    small: "h-10 px-4 rounded-lg font-body1 transition-button",
  };

  const variantClasses = {
    primary:
      "bg-primary-400 text-surface-100 hover:bg-primary-500 border border-transparent disabled:bg-surface-200 disabled:text-text-muted disabled:border-surface-400 disabled:hover:bg-surface-200",
    secondary:
      "bg-surface-200 text-surface-500 border border-transparent hover:bg-surface-300 disabled:bg-surface-100 disabled:text-text-muted disabled:border-surface-400 disabled:hover:bg-surface-100",
    outline:
      "bg-transparent border border-primary-400 text-primary-400 hover:bg-primary-400/5 disabled:bg-surface-100 disabled:border-surface-400 disabled:text-text-muted disabled:hover:bg-surface-100",
    danger:
      "bg-info-red text-surface-100 hover:opacity-90 border border-transparent disabled:bg-surface-200 disabled:text-text-muted disabled:border-surface-400 disabled:hover:bg-surface-200",
    dangerSoft:
      "bg-info-red/10 text-info-red border border-info-red hover:bg-info-red/20 disabled:bg-surface-100 disabled:text-text-muted disabled:border-surface-400 disabled:hover:bg-surface-100",
    gradient:
      "bg-gradient-to-r from-primary-400 to-primary-500 text-surface-100 border border-transparent hover:opacity-90 shadow-primary-500/30 disabled:bg-surface-200 disabled:text-text-muted disabled:border-surface-400 disabled:shadow-none disabled:hover:opacity-100",
    tertiary:
      "h-7! border border-surface-400 text-text-auth-sub px-5 rounded-3xl bg-surface-100 font-body2 hover:bg-surface-200 transition-colors duration-200 ease-in-out disabled:text-text-muted disabled:bg-surface-200 disabled:hover:bg-surface-200",
    custom: "",
  };

  return (
    <button
      className={twMerge(
        "flex items-center justify-center gap-2 whitespace-nowrap",
        sizeClasses[size],
        variantClasses[variant],
        fullWidth && "w-full relative",
        disabled && !isLoading && "cursor-not-allowed",
        isLoading && "cursor-wait opacity-90",
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
