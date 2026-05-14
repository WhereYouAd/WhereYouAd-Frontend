import { Skeleton, SkeletonCircle } from "../common/skeleton/Skeleton";

export default function ProfileSectionSkeleton() {
  return (
    <div className="bg-surface-100 border border-surface-400/30 rounded-component-lg p-8 shadow-Soft">
      <div className="mb-7 flex items-start gap-4">
        <SkeletonCircle className="w-8 h-8" />
        <Skeleton className="w-24 h-7" />
      </div>

      <div className="flex tablet:flex-row gap-10">
        <div className="flex flex-col items-center basis-1/4 shrink-0">
          <Skeleton className="w-24 h-5 mb-4" />
          <SkeletonCircle className="w-60 h-60" />
          <div className="mt-5 flex gap-3">
            <Skeleton className="w-16 h-7 rounded-component-lg" />
            <Skeleton className="w-16 h-7 rounded-component-lg" />
          </div>
        </div>
        <div className="grid grid-cols-1 tablet:grid-cols-2 gap-x-6 basis-3/4 gap-y-5 w-full">
          <div className="col-span-2">
            <Skeleton className="w-16 h-5 mb-2" />
            <Skeleton className="w-full h-12 rounded-xl" />
          </div>
          <div className="col-span-2">
            <Skeleton className="w-20 h-5 mb-2" />
            <Skeleton className="w-full h-12 rounded-xl" />
          </div>
          <div className="col-span-2">
            <Skeleton className="w-20 h-5 mb-2" />
            <Skeleton className="w-full h-12 rounded-xl" />
          </div>
          <div className="col-span-2">
            <Skeleton className="w-24 h-5 mb-2" />
            <Skeleton className="w-full h-12 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
