import type { HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

interface ISkeletonProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Skeleton({ className, ...props }: ISkeletonProps) {
  return (
    <div
      className={twMerge("animate-shimmer rounded bg-gray-200", className)}
      {...props}
    />
  );
}

export function SkeletonCircle({ className, ...props }: ISkeletonProps) {
  return (
    <div
      className={twMerge("animate-shimmer rounded-full bg-gray-200", className)}
      {...props}
    />
  );
}
