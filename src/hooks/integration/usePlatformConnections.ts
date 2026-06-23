import type { IPlatformConnectionItem } from "@/types/integration/platformConnection";

import { mapPlatformAccountsToConnections } from "@/utils/integration/mapPlatformAccounts";

import { useCoreQuery } from "@/hooks/customQuery";

import { getPlatformAccounts } from "@/api/integration/platformAccounts";
import { QUERY_KEYS } from "@/lib/queryKeys";
import useWorkspaceStore from "@/store/useWorkspaceStore";

export function needsIntegrationAttention(
  items: IPlatformConnectionItem[] | undefined,
): boolean {
  return items?.some((item) => item.status === "error") ?? false;
}

export function usePlatformConnections() {
  const orgId = useWorkspaceStore((s) => s.selectedOrgId);

  return useCoreQuery(
    QUERY_KEYS.platform.connections(orgId),
    async () => {
      const { platformAccounts } = await getPlatformAccounts(orgId!);
      return mapPlatformAccountsToConnections(platformAccounts);
    },
    { enabled: orgId != null },
  );
}
