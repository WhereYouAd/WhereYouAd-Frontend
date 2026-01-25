import React from "react";
import cx from "clsx";

interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "big" | "small";
  variant?: "dark" | "gradient" | "custom";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export default function Button({
  size = "small",
  variant = "dark",
  isLoading = false,
  disabled = false,
  leftIcon,
  fullWidth = false,
  className,
  children,
  ...rest
}: IButtonProps) {
  const sizeClasses = {
    big: "h-[55px] px-6 rounded-2xl font-heading3",
    small: "h-[40px] px-4 rounded-2xl font-body1",
  };

  const variantClasses = {
    dark: "bg-brand-800 text-white hover:bg-brand-700 disabled:bg-bg-disabled disabled:text-text-disabled disabled:hover:bg-bg-disabled",
    gradient:
      "bg-linear-to-r from-logo-1 to-logo-2 text-white hover:opacity-90 shadow-brand-500/30 disabled:bg-none disabled:bg-bg-disabled disabled:text-text-disabled disabled:shadow-none disabled:opacity-100",
    custom: "",
  };

  return (
    <button
      className={cx(
        "flex items-center justify-center gap-2 transition-all duration-200 whitespace-nowrap active:scale-[0.98]",
        sizeClasses[size],
        variantClasses[variant],
        fullWidth && "w-full relative",
        (disabled || isLoading) &&
          "opacity-50 cursor-not-allowed pointer-events-none",
        className,
      )}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading && (
        <span className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
      )}
      {!isLoading && leftIcon && (
        <span className={cx(fullWidth ? "absolute left-6" : "")}>
          {leftIcon}
        </span>
      )}
      <span>{children}</span>
    </button>
  );
}
