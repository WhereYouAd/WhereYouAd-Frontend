import type { TIntegrationProvider } from "@/types/integration/platformConnection";

import { startGoogleOAuthLogin } from "@/api/integration/google";
import { startMetaOAuthLogin } from "@/api/integration/meta";

export async function startPlatformConnect(
  provider: TIntegrationProvider,
  orgId: number,
): Promise<void> {
  switch (provider) {
    case "GOOGLE":
      await startGoogleOAuthLogin(orgId);
      return;
    case "META":
      await startMetaOAuthLogin(orgId);
      return;
    case "NAVER":
      // TODO: Naver login URL
      return;
    default:
      return;
  }
}
