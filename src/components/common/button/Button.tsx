import type { ButtonHTMLAttributes, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "big" | "small";
  variant?: "primary" | "secondary" | "outline" | "gradient" | "custom";
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
    big: "h-button-big px-6 rounded-component-md font-heading3",
    small: "h-button-small px-4 rounded-component-md font-body1",
  };

  const variantClasses = {
    primary:
      "bg-brand-800 text-white hover:bg-brand-700 disabled:bg-bg-disabled disabled:text-text-disabled disabled:hover:bg-bg-disabled",
    secondary:
      "bg-gray-100 text-brand-900 hover:bg-gray-200 disabled:bg-bg-disabled disabled:text-text-disabled disabled:hover:bg-bg-disabled",
    outline:
      "bg-transparent border-2 border-brand-800 text-brand-800 hover:bg-brand-50 disabled:border-gray-300 disabled:text-text-disabled disabled:hover:bg-transparent",
    gradient:
      "bg-gradient-to-r from-logo-1 to-logo-2 text-white hover:opacity-90 shadow-brand-500/30 disabled:bg-none disabled:bg-bg-disabled disabled:text-text-disabled disabled:shadow-none disabled:opacity-100",
    custom: "",
  };

  return (
    <button
      className={twMerge(
        "flex items-center justify-center gap-2 transition-smooth active-scale whitespace-nowrap",
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
