import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { IApiErrorResponse } from "@/types/common/common";
import type {
  IPlatformConnectionItem,
  TIntegrationProvider,
} from "@/types/integration/platformConnection";

import { startPlatformConnect } from "@/utils/integration/startPlatformConnect";

import { useCoreMutation } from "@/hooks/customQuery";
import { useRequireOrgId } from "@/hooks/integration/useRequireOrgId";

import {
  disconnectPlatformAccount,
  reconnectPlatformAccount,
} from "@/api/integration/platformAccounts";
import { QUERY_KEYS } from "@/lib/queryKeys";

export type TNaverConnectMode = "connect" | "reconnect";

export type TDisconnectTarget = {
  orgId: number;
  provider: TIntegrationProvider;
  platformAccountId: number;
};

interface IUsePlatformConnectionActionsParams {
  platformConnections: IPlatformConnectionItem[];
  disconnectTarget: TDisconnectTarget | null;
  onOpenNaverConnect: (mode: TNaverConnectMode, customerId?: string) => void;
  onRequestDisconnect: (target: TDisconnectTarget) => void;
  onDisconnectSuccess?: () => void;
}

export function usePlatformConnectionActions({
  platformConnections,
  disconnectTarget,
  onOpenNaverConnect,
  onRequestDisconnect,
  onDisconnectSuccess,
}: IUsePlatformConnectionActionsParams) {
  const queryClient = useQueryClient();
  const { requireOrgId } = useRequireOrgId();

  const invalidateConnections = async (requestOrgId: number) => {
    await queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.platform.connections(requestOrgId),
    });
  };

  const disconnectMutation = useCoreMutation<
    void,
    { orgId: number; accountId: number }
  >(
    ({ orgId: requestOrgId, accountId }) =>
      disconnectPlatformAccount(requestOrgId, accountId),
    {
      userOnSuccess: async (_, { orgId: requestOrgId }) => {
        await invalidateConnections(requestOrgId);
        toast.success("광고 계정 연동을 해제했습니다.");
        onDisconnectSuccess?.();
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
        await invalidateConnections(requestOrgId);
        toast.success("광고 계정을 다시 연동했습니다.");
      },
      userOnError: (apiError) => {
        toast.error(apiError.message ?? "재연동에 실패했습니다.");
      },
    },
  );

  const startNewConnect = async (provider: TIntegrationProvider) => {
    const orgId = requireOrgId();
    if (orgId == null) return;

    if (provider === "NAVER") {
      onOpenNaverConnect("connect");
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
    const orgId = requireOrgId();
    if (orgId == null) return;

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
        onOpenNaverConnect("reconnect", naverItem.externalAccountId);
        return;
      }
    }

    await startNewConnect(provider);
  };

  const handleDisconnect = (item: IPlatformConnectionItem) => {
    const orgId = requireOrgId();
    if (orgId == null) return;

    if (item.platformAccountId == null) {
      toast.error("연동 계정 정보를 찾을 수 없습니다.");
      return;
    }

    onRequestDisconnect({
      orgId,
      provider: item.provider,
      platformAccountId: item.platformAccountId,
    });
  };

  const handleConfirmDisconnect = () => {
    if (disconnectTarget == null || disconnectMutation.isPending) return;

    disconnectMutation.mutate({
      orgId: disconnectTarget.orgId,
      accountId: disconnectTarget.platformAccountId,
    });
  };

  return {
    handleConnect,
    handleDisconnect,
    handleConfirmDisconnect,
    disconnectMutation,
    reconnectMutation,
  };
}
