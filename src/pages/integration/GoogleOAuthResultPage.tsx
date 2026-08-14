import { useGoogleOAuthReturn } from "@/hooks/integration/useGoogleOAuthReturn";
import { usePlatformSyncMutations } from "@/hooks/integration/usePlatformSyncMutations";

export default function GoogleOAuthResultPage() {
  const { syncGoogle } = usePlatformSyncMutations();

  useGoogleOAuthReturn({
    onConnectSuccess: (requestOrgId) => {
      syncGoogle(requestOrgId);
    },
  });

  return (
    <div className="relative flex h-screen w-full items-center justify-center bg-surface-100">
      <p className="font-body1 text-text-muted animate-pulse">
        Google 연동 결과를 처리하는 중...
      </p>
    </div>
  );
}
