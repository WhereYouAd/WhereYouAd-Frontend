import type { HTMLAttributes, ReactNode } from "react";
import { memo } from "react";
import { twMerge } from "tailwind-merge";

export interface ICardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: ReactNode;
  RightElement?: ReactNode;
}

const Card = memo(function Card({
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
        "relative w-full rounded-3xl bg-surface-100 p-7 shadow-Soft",
        className,
      )}
      {...rest}
    >
      {hasHeader && (
        <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
          <div className="flex flex-col gap-1">
            {title && (
              <h3 className="font-heading4 text-text-title">{title}</h3>
            )}
            {description && (
              <div className="font-caption text-text-muted">{description}</div>
            )}
          </div>
          {RightElement}
        </div>
      )}
      {children}
    </div>
  );
});

export default Card;
