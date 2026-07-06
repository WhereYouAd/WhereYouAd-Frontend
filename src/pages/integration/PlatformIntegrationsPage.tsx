import { useState } from "react";
import { toast } from "sonner";

import type { IApiErrorResponse } from "@/types/common/common";
import type {
  IPlatformConnectionItem,
  TIntegrationProvider,
} from "@/types/integration/platformConnection";

import { startPlatformConnect } from "@/utils/integration/startPlatformConnect";

import { useCoreMutation } from "@/hooks/customQuery";
import { useIntegrationOAuthReturn } from "@/hooks/integration/useIntegrationOAuthReturn";
import { usePlatformConnections } from "@/hooks/integration/usePlatformConnections";

import NaverConnectModal from "@/components/integration/NaverConnectModal";
import PlatformDisconnectModal from "@/components/integration/PlatformDisconnectModal";
import PlatformIntegrationCard from "@/components/integration/PlatformIntegrationCard";
import PlatformIntegrationsPageSkeleton from "@/components/integration/skeleton/PlatformIntegrationsSkeleton";
import {
  ComingSoonUpcomingCard,
  KakaoUpcomingCard,
} from "@/components/integration/UpcomingPlatformCard";

import { disconnectPlatformAccount } from "@/api/integration/platformAccounts";
import { QUERY_KEYS } from "@/lib/queryKeys";
import useWorkspaceStore from "@/store/useWorkspaceStore";

export default function PlatformIntegrationsPage() {
  const orgId = useWorkspaceStore((s) => s.selectedOrgId);
  const [isNaverModalOpen, setIsNaverModalOpen] = useState(false);
  const [naverModalMode, setNaverModalMode] = useState<"connect" | "reconnect">(
    "connect",
  );
  const [naverCustomerId, setNaverCustomerId] = useState<string | undefined>();

  const [disconnectTarget, setDisconnectTarget] =
    useState<IPlatformConnectionItem | null>(null);

  const {
    data: platformConnections = [],
    isLoading,
    isError,
    error,
  } = usePlatformConnections();

  const disconnectMutation = useCoreMutation<void, number>(
    (accountId) => {
      if (orgId == null) {
        return Promise.reject(new Error("워크스페이스를 선택해 주세요."));
      }
      return disconnectPlatformAccount(orgId, accountId);
    },
    {
      invalidateKeys:
        orgId != null ? [QUERY_KEYS.platform.connections(orgId)] : [],
      userOnSuccess: () => {
        toast.success("광고 계정 연동을 해제했습니다.");
        setDisconnectTarget(null);
      },
      userOnError: (apiError) => {
        toast.error(apiError.message ?? "연동 해제에 실패했습니다.");
      },
    },
  );

  useIntegrationOAuthReturn(orgId);

  const handleConnect = async (provider: TIntegrationProvider) => {
    if (orgId == null) {
      toast.error("워크스페이스를 선택해 주세요.");
      return;
    }
    if (provider === "NAVER") {
      const naverItem = platformConnections.find((p) => p.provider === "NAVER");

      if (naverItem?.platformAccountId != null) {
        setNaverModalMode("reconnect");
        setNaverCustomerId(naverItem.externalAccountId);
      } else {
        setNaverModalMode("connect");
        setNaverCustomerId(undefined);
      }
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

  const handleDisconnect = (item: IPlatformConnectionItem) => {
    if (orgId == null) {
      toast.error("워크스페이스를 선택해 주세요.");
      return;
    }
    if (item.platformAccountId == null) {
      toast.error("연동 계정 정보를 찾을 수 없습니다.");
      return;
    }
    setDisconnectTarget(item);
  };

  const handleConfirmDisconnect = () => {
    const accountId = disconnectTarget?.platformAccountId;
    if (accountId == null || disconnectMutation.isPending) return;
    disconnectMutation.mutate(accountId);
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
          <ul className="grid w-full min-w-0 list-none grid-cols-3 items-stretch gap-6 p-0 m-0 tablet:grid-cols-1">
            {platformConnections.map((item) => (
              <li
                key={item.provider}
                className="flex h-full min-h-0 w-full min-w-0"
              >
                <PlatformIntegrationCard
                  {...item}
                  onConnect={() => handleConnect(item.provider)}
                  onReconnect={() => handleConnect(item.provider)}
                  onDisconnect={() => handleDisconnect(item)}
                />
              </li>
            ))}
          </ul>

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
