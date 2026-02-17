import {
  Skeleton,
  SkeletonCircle,
} from "@/components/common/skeleton/Skeleton";

export default function LoginPageSkeleton() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-white">
      <div className="w-full max-w-130 px-6 pt-30 pb-12">
        <div className="mb-10 flex justify-center">
          <Skeleton className="h-8 w-32" />
        </div>

        <div className="flex flex-col gap-7">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-12 w-full rounded-2xl" />
          </div>
          <div className="flex flex-col gap-2">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-12 w-full rounded-2xl" />
          </div>

          <div className="mt-3 flex justify-center">
            <Skeleton className="h-4 w-48" />
          </div>

          <div className="mt-10">
            <Skeleton className="h-14 w-full rounded-2xl" />
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center">
          <div className="flex items-center gap-12">
            <SkeletonCircle className="h-14 w-14" />
            <SkeletonCircle className="h-14 w-14" />
            <SkeletonCircle className="h-14 w-14" />
          </div>

          <div className="mt-12 flex w-full items-center gap-4 px-10">
            <Skeleton className="h-px flex-1" />
            <Skeleton className="h-4 w-8 bg-transparent" />
            <Skeleton className="h-px flex-1" />
          </div>

          <div className="mt-6">
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </div>
    </div>
  );
}
