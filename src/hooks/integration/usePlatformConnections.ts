import type { IPlatformConnectionItem } from "@/types/integration/platformConnection";

import { useCoreQuery } from "@/hooks/customQuery";

import { platformConnectionsMock } from "@/pages/integration/platformIntegrations.mock";
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
      // TODO: GET /api/orgs/{orgId}/integrations
      return platformConnectionsMock;
    },
    { enabled: orgId != null },
  );
}
