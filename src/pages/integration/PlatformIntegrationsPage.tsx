import { useState } from "react";

import {
  type TDisconnectTarget,
  usePlatformConnectionActions,
} from "@/hooks/integration/usePlatformConnectionActions";
import { usePlatformConnections } from "@/hooks/integration/usePlatformConnections";
import { useRequireOrgId } from "@/hooks/integration/useRequireOrgId";

import AreaErrorFallback from "@/components/common/error/AreaErrorFallback";
import { ErrorBoundary } from "@/components/common/error/ErrorBoundary";
import NaverConnectModal from "@/components/integration/NaverConnectModal";
import NaverSyncModal from "@/components/integration/NaverSyncModal";
import PlatformDisconnectModal from "@/components/integration/PlatformDisconnectModal";
import PlatformIntegrationCard from "@/components/integration/PlatformIntegrationCard";
import PlatformIntegrationsPageSkeleton from "@/components/integration/skeleton/PlatformIntegrationsSkeleton";
import {
  ComingSoonUpcomingCard,
  KakaoUpcomingCard,
} from "@/components/integration/UpcomingPlatformCard";

export default function PlatformIntegrationsPage() {
  const { orgId } = useRequireOrgId();
  const [isNaverModalOpen, setIsNaverModalOpen] = useState(false);
  const [naverModalMode, setNaverModalMode] = useState<"connect" | "reconnect">(
    "connect",
  );
  const [naverCustomerId, setNaverCustomerId] = useState<string | undefined>();
  const [isNaverSyncModalOpen, setIsNaverSyncModalOpen] = useState(false);
  const [disconnectTarget, setDisconnectTarget] =
    useState<TDisconnectTarget | null>(null);

  const {
    data: platformConnections = [],
    isLoading,
    isError,
    error,
  } = usePlatformConnections();

  const {
    handleConnect,
    handleDisconnect,
    handleConfirmDisconnect,
    handleSync,
    handleNaverSyncSubmit,
    disconnectMutation,
    reconnectMutation,
    isSyncPending,
    isNaverSyncPending,
    syncingProvider,
  } = usePlatformConnectionActions({
    platformConnections,
    disconnectTarget,
    onOpenNaverConnect: (mode, customerId) => {
      setNaverModalMode(mode);
      setNaverCustomerId(customerId);
      setIsNaverModalOpen(true);
    },
    onOpenNaverSync: () => setIsNaverSyncModalOpen(true),
    onNaverSyncSuccess: () => setIsNaverSyncModalOpen(false),
    onRequestDisconnect: setDisconnectTarget,
    onDisconnectSuccess: () => setDisconnectTarget(null),
  });

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
        <>
          <ErrorBoundary
            FallbackComponent={AreaErrorFallback}
            resetKeys={[platformConnections]}
          >
            <ul className="grid w-full min-w-0 list-none grid-cols-3 items-stretch gap-6 p-0 m-0 tablet:grid-cols-1">
              {platformConnections.map((item) => (
                <li
                  key={item.provider}
                  className="flex h-full min-h-0 w-full min-w-0"
                  data-tour={`tour-platform-${item.provider.toLowerCase()}`}
                >
                  <PlatformIntegrationCard
                    {...item}
                    onConnect={() => handleConnect(item.provider)}
                    onReconnect={() => handleConnect(item.provider)}
                    onDisconnect={() => handleDisconnect(item)}
                    onSync={() => handleSync(item.provider)}
                    isConnectLoading={
                      reconnectMutation.isPending &&
                      reconnectMutation.variables?.accountId ===
                        item.platformAccountId
                    }
                    isSyncLoading={
                      syncingProvider === item.provider && isSyncPending
                    }
                  />
                </li>
              ))}
            </ul>
          </ErrorBoundary>

          <div className="flex w-full min-w-0 flex-col items-center gap-8 pt-15 mobile:gap-6 mobile:pt-10">
            <p className="w-full text-center font-body1-rsp text-text-muted/70">
              더 많은 플랫폼 연동을 준비하고 있어요. 지원 범위는 변경될 수
              있습니다.
            </p>

            <ul className="m-0 flex w-full min-w-0 list-none flex-wrap justify-center gap-6 p-0 tablet:flex-col">
              <li className="flex h-full min-h-0 w-full min-w-0 max-w-96 tablet:max-w-none">
                <KakaoUpcomingCard />
              </li>
              <li className="flex h-full min-h-0 w-full min-w-0 max-w-96 tablet:max-w-none">
                <ComingSoonUpcomingCard />
              </li>
            </ul>
          </div>
        </>
      )}
      {orgId != null ? (
        <NaverConnectModal
          isOpen={isNaverModalOpen}
          onClose={() => setIsNaverModalOpen(false)}
          orgId={orgId}
          mode={naverModalMode}
          initialCustomerId={naverCustomerId}
          onConnectSuccess={() => setIsNaverSyncModalOpen(true)}
        />
      ) : null}
      {orgId != null ? (
        <NaverSyncModal
          isOpen={isNaverSyncModalOpen}
          onClose={() => {
            if (isNaverSyncPending) return;
            setIsNaverSyncModalOpen(false);
          }}
          onSubmit={handleNaverSyncSubmit}
          isLoading={isNaverSyncPending}
        />
      ) : null}
      <PlatformDisconnectModal
        isOpen={disconnectTarget != null}
        onClose={() => setDisconnectTarget(null)}
        provider={disconnectTarget?.provider ?? "META"}
        onConfirm={handleConfirmDisconnect}
        isLoading={disconnectMutation.isPending}
      />
    </section>
  );
}
