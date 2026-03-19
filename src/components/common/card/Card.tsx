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
        "bg-white/80 backdrop-blur-sm rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-7 border border-white/40 transition-shadow duration-300 hover:shadow-[0_12px_45px_rgba(0,0,0,0.06)] relative",
        className,
      )}
      {...rest}
    >
      {hasHeader && (
        <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
          <div className="flex flex-col gap-1">
            {title && (
              <h3 className="font-heading4 font-semibold! text-text-main">
                {title}
              </h3>
            )}
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
});

export default Card;
