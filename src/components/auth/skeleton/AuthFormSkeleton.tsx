import { Skeleton } from "@/components/common/skeleton/Skeleton";

export default function AuthFormSkeleton() {
  return (
    <div className="flex w-full flex-col items-center bg-white">
      <div className="w-full max-w-[360px]">
        <div className="mb-10 flex flex-col gap-2">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-8 w-56" />
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex gap-2">
            <Skeleton className="h-14 flex-1 rounded-2xl" />
            <Skeleton className="h-14 w-28 rounded-2xl" />
          </div>

          <Skeleton className="h-14 w-full rounded-2xl" />

          <div className="mt-4">
            <Skeleton className="h-14 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
