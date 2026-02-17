import { Skeleton } from "@/components/common/skeleton/Skeleton";

export default function SignupPageSkeleton() {
  return (
    <div className="flex w-full flex-col items-center">
      <div className="flex w-full flex-col gap-10">
        <Skeleton className="h-16 w-full rounded-2xl" />
        <Skeleton className="h-16 w-full rounded-2xl" />
        <Skeleton className="h-16 w-full rounded-2xl" />
        <Skeleton className="h-16 w-full rounded-2xl" />
      </div>

      <div className="mt-15 flex justify-center gap-2">
        <Skeleton className="h-4 w-40" />
      </div>
    </div>
  );
}
