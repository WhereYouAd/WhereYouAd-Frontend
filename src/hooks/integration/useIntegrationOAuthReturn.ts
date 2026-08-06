import { useLayoutEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { QUERY_KEYS } from "@/lib/queryKeys";

const OAUTH_RETURN_PROVIDERS = ["GOOGLE"] as const;

type TOAuthReturnProvider = (typeof OAUTH_RETURN_PROVIDERS)[number];

function isOAuthReturnProvider(
  value: string | null,
): value is TOAuthReturnProvider {
  return OAUTH_RETURN_PROVIDERS.includes(value as TOAuthReturnProvider);
}

const PROVIDER_LABEL: Record<TOAuthReturnProvider, string> = {
  GOOGLE: "Google",
};

interface IUseIntegrationOAuthReturnOptions {
  /** Google OAuth success 직후 초기 sync */
  onGoogleConnectSuccess?: (requestOrgId: number) => void;
}

/** OAuth 연동 완료 후 `/integrations?status=&provider=` 쿼리 처리 (Google 전용) */
export function useIntegrationOAuthReturn(
  orgId: number | null,
  options?: IUseIntegrationOAuthReturnOptions,
) {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const processedRef = useRef(false);

  const onGoogleConnectSuccessRef = useRef(options?.onGoogleConnectSuccess);
  onGoogleConnectSuccessRef.current = options?.onGoogleConnectSuccess;

  useLayoutEffect(() => {
    if (orgId == null) return;

    const status = searchParams.get("status");
    const provider = searchParams.get("provider");

    if (!status || !isOAuthReturnProvider(provider)) {
      processedRef.current = false;
      return;
    }

    if (processedRef.current) return;

    processedRef.current = true;

    const detail = searchParams.get("detail");
    const label = PROVIDER_LABEL[provider];

    if (status === "success") {
      toast.success(`${label} 광고 계정을 연동했습니다.`);
      onGoogleConnectSuccessRef.current?.(orgId);
    } else {
      toast.error(detail ?? `${label} 연동에 실패했습니다.`);
    }

    void queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.platform.connections(orgId),
    });

    setSearchParams({}, { replace: true });
  }, [orgId, queryClient, searchParams, setSearchParams]);
}
