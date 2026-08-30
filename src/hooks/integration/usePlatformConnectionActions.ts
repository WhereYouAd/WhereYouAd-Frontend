import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useCoreMutation } from "@/hooks/customQuery";

import {
  disconnectPlatformAccount,
  reconnectPlatformAccount,
} from "@/api/integration/platformAccounts";
import { QUERY_KEYS } from "@/lib/queryKeys";

interface IUsePlatformConnectionActionsOptions {
  /** 연동 해제 성공 — 해제 모달 닫기 */
  onDisconnectSuccess?: () => void;
}

/** 플랫폼 연동 해제·재연동 mutation */
export function usePlatformConnectionActions(
  options?: IUsePlatformConnectionActionsOptions,
) {
  const queryClient = useQueryClient();
  const { onDisconnectSuccess } = options ?? {};

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

  return {
    disconnectMutation,
    reconnectMutation,
  };
}
