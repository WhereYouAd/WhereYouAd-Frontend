import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { IApiErrorResponse } from "@/types/common/common";
import type {
  IPlatformConnectionItem,
  TIntegrationProvider,
} from "@/types/integration/platformConnection";

import type { TNaverSyncFormValues } from "@/utils/integration/naverSyncSchema";
import { startPlatformConnect } from "@/utils/integration/startPlatformConnect";

import { useCoreMutation } from "@/hooks/customQuery";
import { useIntegrationOAuthReturn } from "@/hooks/integration/useIntegrationOAuthReturn";
import { usePlatformConnections } from "@/hooks/integration/usePlatformConnections";
import { usePlatformSyncMutations } from "@/hooks/integration/usePlatformSyncMutations";

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

import {
  disconnectPlatformAccount,
  reconnectPlatformAccount,
} from "@/api/integration/platformAccounts";
import { QUERY_KEYS } from "@/lib/queryKeys";
import useWorkspaceStore from "@/store/useWorkspaceStore";

type TDisconnectTarget = {
  orgId: number;
  provider: TIntegrationProvider;
  platformAccountId: number;
  externalAccountId?: string;
};

export default function PlatformIntegrationsPage() {
  const queryClient = useQueryClient();
  const orgId = useWorkspaceStore((s) => s.selectedOrgId);
  const [isNaverModalOpen, setIsNaverModalOpen] = useState(false);
  const [naverModalMode, setNaverModalMode] = useState<"connect" | "reconnect">(
    "connect",
  );
  const [naverCustomerId, setNaverCustomerId] = useState<string | undefined>();
  const [isNaverSyncModalOpen, setIsNaverSyncModalOpen] = useState(false);
  const [syncingProvider, setSyncingProvider] =
    useState<TIntegrationProvider | null>(null);

  const [disconnectTarget, setDisconnectTarget] =
    useState<TDisconnectTarget | null>(null);

  const {
    data: platformConnections = [],
    isLoading,
    isError,
    error,
  } = usePlatformConnections();

  const disconnectMutation = useCoreMutation<
    void,
    { orgId: number; accountId: number }
  >(
    ({ orgId: requestOrgId, accountId }) =>
      disconnectPlatformAccount(requestOrgId, accountId),
    {
      userOnSuccess: async (_, { orgId: requestOrgId }) => {
        await queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.platform.connections(requestOrgId),
        });
        toast.success("광고 계정 연동을 해제했습니다.");
        setDisconnectTarget(null);
      },
      userOnError: (apiError) => {
        toast.error(apiError.message ?? "연동 해제에 실패했습니다.");
      },
    },
  );

  const reconnectMutation = useCoreMutation<
    void,
    { orgId: number; accountId: number }
  >(
    ({ orgId: requestOrgId, accountId }) =>
      reconnectPlatformAccount(requestOrgId, accountId),
    {
      userOnSuccess: async (_, { orgId: requestOrgId }) => {
        await queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.platform.connections(requestOrgId),
        });
        toast.success("광고 계정을 다시 연동했습니다.");
      },
      userOnError: (apiError) => {
        toast.error(apiError.message ?? "재연동에 실패했습니다.");
      },
    },
  );

  const { syncMeta, syncGoogle, syncNaver, isSyncPending, isNaverSyncPending } =
    usePlatformSyncMutations({
      onSyncSettled: () => setSyncingProvider(null),
      onNaverSyncSuccess: () => setIsNaverSyncModalOpen(false),
    });

  useIntegrationOAuthReturn(orgId, {
    onGoogleConnectSuccess: (requestOrgId) => syncGoogle(requestOrgId),
  });

  const startNewConnect = async (provider: TIntegrationProvider) => {
    if (orgId == null) {
      toast.error("워크스페이스를 선택해 주세요.");
      return;
    }

    if (provider === "NAVER") {
      setNaverModalMode("connect");
      setNaverCustomerId(undefined);
      setIsNaverModalOpen(true);
      return;
    }

    try {
      await startPlatformConnect(provider, orgId);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : ((err as IApiErrorResponse)?.message ??
            "플랫폼 연동을 시작하지 못했습니다. 다시 시도해 주세요.");
      toast.error(message);
    }
  };

  const handleConnect = async (provider: TIntegrationProvider) => {
    if (orgId == null) {
      toast.error("워크스페이스를 선택해 주세요.");
      return;
    }

    const item = platformConnections.find((p) => p.provider === provider);
    if (item?.status === "disconnected" && item.platformAccountId != null) {
      if (reconnectMutation.isPending) return;
      reconnectMutation.mutate({
        orgId,
        accountId: item.platformAccountId,
      });
      return;
    }

    if (provider === "NAVER") {
      const naverItem = platformConnections.find((p) => p.provider === "NAVER");

      if (naverItem?.platformAccountId != null) {
        setNaverModalMode("reconnect");
        setNaverCustomerId(naverItem.externalAccountId);
        setIsNaverModalOpen(true);
        return;
      }
    }

    await startNewConnect(provider);
  };

  const handleDisconnect = (item: IPlatformConnectionItem) => {
    if (orgId == null) {
      toast.error("워크스페이스를 선택해 주세요.");
      return;
    }
    if (item.platformAccountId == null) {
      toast.error("연동 계정 정보를 찾을 수 없습니다.");
      return;
    }
    setDisconnectTarget({
      orgId,
      provider: item.provider,
      platformAccountId: item.platformAccountId,
      externalAccountId: item.externalAccountId,
    });
  };

  const handleConfirmDisconnect = () => {
    if (disconnectTarget == null || disconnectMutation.isPending) return;

    disconnectMutation.mutate({
      orgId: disconnectTarget.orgId,
      accountId: disconnectTarget.platformAccountId,
    });
  };

  const handleSync = (provider: TIntegrationProvider) => {
    if (orgId == null) {
      toast.error("워크스페이스를 선택해 주세요.");
      return;
    }

    if (isSyncPending) return;

    const item = platformConnections.find((p) => p.provider === provider);
    if (item?.status !== "connected") return;

    if (provider === "NAVER") {
      setIsNaverSyncModalOpen(true);
      return;
    }

    setSyncingProvider(provider);

    if (provider === "META") {
      syncMeta(orgId);
      return;
    }

    if (provider === "GOOGLE") {
      syncGoogle(orgId);
    }
  };

  const handleNaverSyncSubmit = (values: TNaverSyncFormValues) => {
    if (orgId == null || isNaverSyncPending) return;

    setSyncingProvider("NAVER");
    syncNaver(orgId, values);
  };

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

          <div className="flex w-full min-w-0 flex-col items-center gap-8 pt-15">
            <p className="w-full text-center font-body1 text-text-muted/70">
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
        externalAccountId={disconnectTarget?.externalAccountId}
        onConfirm={handleConfirmDisconnect}
        isLoading={disconnectMutation.isPending}
      />
    </section>
  );
}
