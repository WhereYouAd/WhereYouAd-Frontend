import type { HTMLAttributes, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export interface ICardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: ReactNode;
  RightElement?: ReactNode;
}

export default function Card({
  title,
  description,
  RightElement,
  children,
  className,
  ...rest
}: ICardProps) {
  const hasHeader = title || description || RightElement;

  return (
    <div
      className={twMerge(
        "bg-white rounded-component-md border border-chart-inactive p-5",
        className,
      )}
      {...rest}
    >
      {hasHeader && (
        <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
          <div className="flex flex-col gap-0.5">
            {title && <h3 className="font-body1 text-text-main">{title}</h3>}
            {description && (
              <div className="font-caption text-text-sub">{description}</div>
            )}
          </div>
          {RightElement}
        </div>
      )}
      {children}
    </div>
  );
}
