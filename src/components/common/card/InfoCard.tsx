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
        "flex h-40 w-full flex-col gap-4 rounded-2xl border border-surface-400 bg-surface-100 p-5 transition-all duration-normal",

        className,
      )}
    >
      <h3 className="text-center font-heading4 text-text-title">{title}</h3>
      <div className="flex flex-1 items-center justify-center w-full">
        {children}
      </div>
    </div>
  );
}
