import { Skeleton } from "@/components/common/skeleton/Skeleton";

export default function SignupPageSkeleton() {
  return (
    <div className="flex w-full max-w-130 flex-col items-center px-6">
      <div className="flex w-full flex-col gap-10">
        <Skeleton className="h-16 w-full rounded-component-md" />
        <Skeleton className="h-16 w-full rounded-component-md" />
        <Skeleton className="h-16 w-full rounded-component-md" />
        <Skeleton className="h-16 w-full rounded-component-md" />
      </div>

      <div className="mt-15 flex justify-center gap-2">
        <Skeleton className="h-4 w-40" />
      </div>
    </div>
  );
}
