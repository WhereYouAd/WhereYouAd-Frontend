import type { IPlatformConnectionItem } from "@/types/integration/platformConnection";

import { mapPlatformAccountsToConnections } from "@/utils/integration/mapPlatformAccounts";

import { useCoreQuery } from "@/hooks/customQuery";

import { platformAccountsApiMock } from "@/pages/integration/platformIntegrations.mock";
import useWorkspaceStore from "@/store/useWorkspaceStore";

export function needsIntegrationAttention(
  items: IPlatformConnectionItem[] | undefined,
): boolean {
  return items?.some((item) => item.status === "error") ?? false;
}

export function usePlatformConnections() {
  const orgId = useWorkspaceStore((s) => s.selectedOrgId);

  return useCoreQuery(
    ["platform-connections", orgId],
    async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 800);
      });
      return mapPlatformAccountsToConnections(platformAccountsApiMock);
    },
    { enabled: orgId != null },
  );
}
