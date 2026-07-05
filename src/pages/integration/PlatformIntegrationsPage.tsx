import { useState } from "react";
import { toast } from "sonner";

import type { IApiErrorResponse } from "@/types/common/common";
import type {
  TIntegrationProvider,
  TPlatformConnectionStatus,
} from "@/types/integration/platformConnection";

import { startPlatformConnect } from "@/utils/integration/startPlatformConnect";

import { usePlatformConnections } from "@/hooks/integration/usePlatformConnections";

import NaverConnectModal from "@/components/integration/NaverConnectModal";
import PlatformIntegrationCard from "@/components/integration/PlatformIntegrationCard";
import PlatformIntegrationsPageSkeleton from "@/components/integration/skeleton/PlatformIntegrationsSkeleton";
import {
  ComingSoonUpcomingCard,
  KakaoUpcomingCard,
} from "@/components/integration/UpcomingPlatformCard";

import useWorkspaceStore from "@/store/useWorkspaceStore";

export default function PlatformIntegrationsPage() {
  const orgId = useWorkspaceStore((s) => s.selectedOrgId);
  const [isNaverModalOpen, setIsNaverModalOpen] = useState(false);
  const [naverModalMode, setNaverModalMode] = useState<"connect" | "reconnect">(
    "connect",
  );
  const [naverCustomerId, setNaverCustomerId] = useState<string | undefined>();

  const {
    data: platformConnections = [],
    isLoading,
    isError,
    error,
  } = usePlatformConnections();

  const handleConnect = async (
    provider: TIntegrationProvider,
    status: TPlatformConnectionStatus,
  ) => {
    if (orgId == null) {
      toast.error("워크스페이스를 선택해 주세요.");
      return;
    }
    if (provider === "NAVER") {
      if (status === "disconnected") {
        setNaverModalMode("connect");
        setNaverCustomerId(undefined);
      } else {
        const naverItem = platformConnections.find(
          (p) => p.provider === "NAVER",
        );
        setNaverModalMode("reconnect");
        setNaverCustomerId(naverItem?.externalAccountId);
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
                  onConnect={() => handleConnect(item.provider, item.status)}
                  onReconnect={() => handleConnect(item.provider, item.status)}
                  onDisconnect={() => toast.message("연결 해제")}
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
    </section>
  );
}
