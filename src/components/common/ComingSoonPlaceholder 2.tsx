import type { ReactNode } from "react";
import { memo } from "react";
import { twMerge } from "tailwind-merge";

import WarningIcon from "@/assets/icon/ai/warning.svg?react";

export interface IComingSoonPlaceholderProps {
  title: ReactNode;
  description: ReactNode;
  footer: ReactNode;
  className?: string;
}

const ComingSoonPlaceholder = memo(function ComingSoonPlaceholder({
  title,
  description,
  footer,
  className,
}: IComingSoonPlaceholderProps) {
  return (
    <div
      className={twMerge(
        "flex h-full min-h-[70vh] w-full flex-1 flex-col items-center justify-center p-4",
        className,
      )}
    >
      <div
        className="coming-soon-stagger flex w-full max-w-[420px] flex-col items-center rounded-[32px] bg-white px-8 py-12 text-center shadow-card transition-smooth hover:shadow-card-hover tablet:px-6"
        role="status"
        aria-live="polite"
      >
        <div className="mb-6 flex items-center justify-center">
          <WarningIcon className="h-30 w-auto shrink-0" aria-hidden />
        </div>

        <h1 className="mb-4 text-balance font-heading1 font-bold leading-snug tracking-tight text-text-main">
          {title}
        </h1>

        <p className="break-keep font-body1 leading-relaxed text-text-auth-sub">
          {description}
        </p>

        <div className="mt-8 flex w-full items-center justify-center rounded-component-md bg-chart-inactive px-6 py-4">
          <p className="font-body1 font-medium text-text-main">{footer}</p>
        </div>
      </div>
    </div>
  );
});

export default ComingSoonPlaceholder;
