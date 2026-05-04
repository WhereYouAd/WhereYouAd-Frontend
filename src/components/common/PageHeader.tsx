import type { ReactNode } from "react";
import { memo } from "react";
import { twMerge } from "tailwind-merge";

interface IPageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

const PageHeader = memo(function PageHeader({
  title,
  description,
  actions,
  className,
}: IPageHeaderProps) {
  return (
    <header
      className={twMerge(
        "flex items-center justify-between tablet:items-start tablet:gap-3",
        className,
      )}
    >
      <div className="flex flex-col gap-1">
        <h1 className="font-heading2 text-text-main">{title}</h1>
        {description && (
          <p className="font-body2 text-text-sub">{description}</p>
        )}
      </div>
      {actions && <div>{actions}</div>}
    </header>
  );
});

export default PageHeader;
