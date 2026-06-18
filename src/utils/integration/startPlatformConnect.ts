import type { TIntegrationProvider } from "@/types/integration/platformConnection";

import { startGoogleOAuthLogin } from "@/api/integration/google";

export async function startPlatformConnect(
  provider: TIntegrationProvider,
  orgId: number,
): Promise<void> {
  switch (provider) {
    case "GOOGLE":
      await startGoogleOAuthLogin(orgId);
      return;
    case "META":
    case "NAVER":
      // TODO: Meta/Naver login URL
      return;
    default:
      return;
  }
}
