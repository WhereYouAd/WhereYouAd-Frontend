import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface IInfoCardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export default function InfoCard({
  title,
  children,
  className,
}: IInfoCardProps) {
  return (
    <div
      className={twMerge(
        "flex flex-col gap-4 p-5 h-40 w-full border-bg-disabled rounded-component-md border bg-white transition-all duration-normal",

        className,
      )}
    >
      {/* title */}
      <h3 className="font-heading4 text-text-main text-center">{title}</h3>

      {/* content */}
      <div className="flex flex-1 items-center justify-center w-full">
        {children}
      </div>
    </div>
  );
}
