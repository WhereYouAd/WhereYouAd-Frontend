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
      throw new Error("네이버 연동은 모달에서 처리합니다.");
    default:
      return;
  }
}
