import { Skeleton, SkeletonCircle } from "../common/skeleton/Skeleton";

export default function PasswordSectionSkeleton() {
  return (
    <div className="bg-white border border-gray-100 rounded-component-lg p-8 shadow-Soft">
      <div className="mb-7">
        <div className="flex gap-4 items-center mb-3">
          <SkeletonCircle className="w-8 h-8" />
          <Skeleton className="w-40 h-7" />
        </div>
        <Skeleton className="w-96 h-4 mb-2" />
        <Skeleton className="w-80 h-4" />
      </div>
      <div className="grid grid-cols-1 gap-y-6 tablet:max-w-4xl">
        <div>
          <Skeleton className="w-32 h-5 mb-2" />
          <Skeleton className="w-full h-12 rounded-xl" />
        </div>
        <div>
          <Skeleton className="w-32 h-5 mb-2" />
          <Skeleton className="w-full h-12 rounded-xl" />
        </div>
        <div>
          <Skeleton className="w-40 h-5 mb-2" />
          <Skeleton className="w-full h-12 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
