import { memo } from "react";

import Button from "@/components/common/button/Button";

import type { FallbackProps } from "./ErrorBoundary";

import WarnCircleIcon from "@/assets/icon/common/warn-circle.svg?react";

const MetricErrorFallback = memo(function MetricErrorFallback({
  resetErrorBoundary,
}: FallbackProps) {
  return (
    <div
      role="alert"
      className="col-span-4 flex min-h-28 flex-col items-center justify-center gap-4 rounded-3xl border border-surface-200 bg-surface-100/80 px-6 py-8 text-center backdrop-blur-sm"
    >
      <WarnCircleIcon
        className="h-8 w-8 shrink-0 text-info-red"
        aria-hidden="true"
      />
      <div className="flex flex-col gap-1">
        <p className="font-body1 text-text-title">지표를 불러오지 못했어요</p>
        <p className="font-body2 text-text-muted">
          일시적인 오류입니다. 잠시 후 다시 시도해 주세요.
        </p>
      </div>
      <Button variant="outline" size="small" onClick={resetErrorBoundary}>
        다시 시도
      </Button>
    </div>
  );
});

export default MetricErrorFallback;
