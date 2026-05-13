import Card from "../common/card/Card";
import { Skeleton } from "../common/skeleton/Skeleton";

export default function WorkspaceSettingLoading() {
  return (
    <section
      role="status"
      aria-label="워크스페이스 설정 불러오는 중"
      className="w-full flex flex-col gap-8"
    >
      <Card className="p-8">
        <div className="mt-9 flex flex-row gap-12 items-start tablet:flex-col tablet:gap-8">
          <div className="flex flex-col items-center w-60 tablet:w-full shrink-0">
            <Skeleton className="h-5 w-24 mb-3 self-start tablet:self-center" />
            <Skeleton className="h-60 w-60 rounded-lg tablet:h-46 tablet:w-46" />
            <div className="flex gap-2 mt-4 justify-center">
              <Skeleton className="h-7 w-18 rounded-3xl" />
              <Skeleton className="h-7 w-18 rounded-3xl" />
            </div>
          </div>
          <div className="flex-1 w-full space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-12 w-full rounded-2xl" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-90 w-full rounded-2xl" />
            </div>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap justify-end gap-3 tablet:flex-col">
          <Skeleton className="h-12 w-36 rounded-2xl tablet:w-full" />
          <Skeleton className="h-12 w-44 rounded-2xl tablet:w-full" />
        </div>
      </Card>
    </section>
  );
}
