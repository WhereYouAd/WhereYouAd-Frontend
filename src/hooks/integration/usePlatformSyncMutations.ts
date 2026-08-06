import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type {
  IGoogleSyncData,
  IMetaSyncData,
  INaverSyncData,
} from "@/types/integration/platformSync";

import type { TNaverSyncFormValues } from "@/utils/integration/naverSyncSchema";
import { getPlatformSyncToast } from "@/utils/integration/platformSync";

import { useCoreMutation } from "@/hooks/customQuery";

import { syncGoogleAdData } from "@/api/integration/google";
import { syncMetaAdData } from "@/api/integration/meta";
import { syncNaverAdData } from "@/api/integration/naver";
import { QUERY_KEYS } from "@/lib/queryKeys";

interface IUsePlatformSyncMutationsOptions {
  /** sync success/error 공통 — syncingProvider 초기화 */
  onSyncSettled?: () => void;
  /** Naver sync success — sync 모달 닫기 */
  onNaverSyncSuccess?: () => void;
}

export function usePlatformSyncMutations(
  options?: IUsePlatformSyncMutationsOptions,
) {
  const queryClient = useQueryClient();
  const { onSyncSettled, onNaverSyncSuccess } = options ?? {};

  const invalidateConnections = async (requestOrgId: number) => {
    await queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.platform.connections(requestOrgId),
    });
  };

  const metaSyncMutation = useCoreMutation<IMetaSyncData, number>(
    (requestOrgId) => syncMetaAdData(requestOrgId),
    {
      userOnSuccess: async (data, requestOrgId) => {
        await invalidateConnections(requestOrgId);
        const { type, message } = getPlatformSyncToast("META", data);
        if (type === "success") toast.success(message);
        else toast.warning(message);
        onSyncSettled?.();
      },
      userOnError: (apiError) => {
        toast.error(apiError.message ?? "Meta 동기화에 실패했습니다.");
        onSyncSettled?.();
      },
    },
  );

  const googleSyncMutation = useCoreMutation<IGoogleSyncData, number>(
    () => syncGoogleAdData(),
    {
      userOnSuccess: async (data, requestOrgId) => {
        await invalidateConnections(requestOrgId);
        const { type, message } = getPlatformSyncToast("GOOGLE", data);
        if (type === "success") toast.success(message);
        else toast.warning(message);
        onSyncSettled?.();
      },
      userOnError: (apiError) => {
        toast.error(apiError.message ?? "Google 동기화에 실패했습니다.");
        onSyncSettled?.();
      },
    },
  );

  const naverSyncMutation = useCoreMutation<
    INaverSyncData,
    { requestOrgId: number; body: TNaverSyncFormValues }
  >(({ requestOrgId, body }) => syncNaverAdData(requestOrgId, body), {
    userOnSuccess: async (data, { requestOrgId }) => {
      await invalidateConnections(requestOrgId);
      const { type, message } = getPlatformSyncToast("NAVER", data);
      if (type === "success") toast.success(message);
      else toast.warning(message);
      onSyncSettled?.();
      onNaverSyncSuccess?.();
    },
    userOnError: (apiError) => {
      toast.error(apiError.message ?? "네이버 동기화에 실패했습니다.");
      onSyncSettled?.();
    },
  });

  const isSyncPending =
    metaSyncMutation.isPending ||
    googleSyncMutation.isPending ||
    naverSyncMutation.isPending;

  return {
    syncMeta: (requestOrgId: number) => metaSyncMutation.mutate(requestOrgId),
    syncGoogle: (requestOrgId: number) =>
      googleSyncMutation.mutate(requestOrgId),
    syncNaver: (requestOrgId: number, body: TNaverSyncFormValues) =>
      naverSyncMutation.mutate({ requestOrgId, body }),
    isSyncPending,
    isNaverSyncPending: naverSyncMutation.isPending,
  };
}
