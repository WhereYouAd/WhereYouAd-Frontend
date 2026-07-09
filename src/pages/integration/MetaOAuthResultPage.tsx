import { useMetaOAuthReturn } from "@/hooks/integration/useMetaOAuthReturn";

export default function MetaOAuthResultPage() {
  useMetaOAuthReturn();

  return (
    <div className="relative flex h-screen w-full items-center justify-center bg-surface-100">
      <p className="font-body1 text-text-muted animate-pulse">
        Meta 연동 결과를 처리하는 중...
      </p>
    </div>
  );
}
