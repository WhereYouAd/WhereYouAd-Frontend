import { toast } from "sonner";

import { usePlatformConnections } from "@/hooks/integration/usePlatformConnections";

import PlatformIntegrationCard from "@/components/integration/PlatformIntegrationCard";
import PlatformIntegrationsPageSkeleton from "@/components/integration/skeleton/PlatformIntegrationsSkeleton";

export default function PlatformIntegrationsPage() {
  const {
    data: platformConnections = [],
    isLoading,
    isError,
    error,
  } = usePlatformConnections();

  return (
    <section className="flex w-full min-w-0 flex-col gap-6">
      {isLoading ? (
        <PlatformIntegrationsPageSkeleton />
      ) : isError ? (
        <div className="flex min-h-40 items-center justify-center rounded-3xl bg-surface-100 p-8 shadow-Soft">
          <p className="text-center font-body2 text-text-muted">
            {error?.message ??
              "플랫폼 연동 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요."}
          </p>
        </div>
      ) : (
        <ul className="grid w-full min-w-0 list-none grid-cols-3 items-stretch gap-6 p-0 m-0 tablet:grid-cols-1">
          {platformConnections.map((item) => (
            <li
              key={item.provider}
              className="flex h-full min-h-0 w-full min-w-0"
            >
              <PlatformIntegrationCard
                {...item}
                onConnect={() => toast.message("연동하기")}
                onReconnect={() => toast.message("재연동")}
                onDisconnect={() => toast.message("연결 해제")}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
