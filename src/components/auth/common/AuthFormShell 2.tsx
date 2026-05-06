import { type ReactNode } from "react";
import { twMerge } from "tailwind-merge";

const shellBase = "mx-auto w-full max-w-130 px-6";

type TAuthFormShellVariant = "page" | "social" | "step";

const variantClasses: Record<TAuthFormShellVariant, string> = {
  page: "py-12",
  social: "flex flex-col items-center",
  step: "pb-12",
};

interface IAuthFormShellProps {
  children: ReactNode;
  variant?: TAuthFormShellVariant;
  className?: string;
}

export default function AuthFormShell({
  children,
  variant = "step",
  className,
}: IAuthFormShellProps) {
  return (
    <div className={twMerge(shellBase, variantClasses[variant], className)}>
      {children}
    </div>
  );
}
