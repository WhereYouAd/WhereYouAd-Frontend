import { Skeleton } from "../common/skeleton/Skeleton";

export default function WorkspaceSettingLoading() {
  return (
    <section
      role="status"
      aria-label="워크스페이스 설정 불러오는 중"
      className="w-full flex flex-col gap-8"
    >
      <div className="bg-white border border-gray-100 rounded-component-lg p-8 shadow-Soft">
        <div className="mt-9 flex flex-row gap-12 items-start tablet:flex-col tablet:gap-8">
          <div className="flex flex-col items-center w-60 tablet:w-full shrink-0">
            <Skeleton className="h-5 w-24 mb-3 self-start tablet:self-center" />
            <Skeleton className="h-60 w-60 rounded-component-sm tablet:h-46 tablet:w-46" />
            <div className="flex gap-2 mt-4 justify-center">
              <Skeleton className="h-7 w-18 rounded-component-lg" />
              <Skeleton className="h-7 w-18 rounded-component-lg" />
            </div>
          </div>
          <div className="flex-1 w-full space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-12 w-full rounded-component-md" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-90 w-full rounded-component-md" />
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-6 gap-4 tablet:flex-col">
          <Skeleton className="h-12 w-40 rounded-component-md tablet:w-full" />
        </div>
      </div>
      <div className="w-full">
        <div className="flex items-center h-41 rounded-component-lg border border-status-red/20 bg-status-red/5 p-6">
          <div className="flex w-full items-center justify-between gap-4 tablet:flex-col tablet:items-stretch">
            <div className="flex items-start gap-4">
              <Skeleton className="w-12 h-12 rounded-full shrink-0" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-6 w-12" />
                <Skeleton className="h-4 w-50" />
                <Skeleton className="h-4 w-50" />
              </div>
            </div>
            <Skeleton className="h-12 w-40 rounded-component-md tablet:w-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
