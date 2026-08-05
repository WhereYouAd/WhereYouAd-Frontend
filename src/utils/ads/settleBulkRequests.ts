export interface IBulkSettleResult {
  successCount: number;
  total: number;
  firstError: unknown;
}

/** Promise.allSettled — 개별 성공·실패 집계 */
export async function settleBulkRequests<T>(
  requests: Promise<T>[],
): Promise<IBulkSettleResult> {
  if (requests.length === 0) {
    return { successCount: 0, total: 0, firstError: undefined };
  }

  const results = await Promise.allSettled(requests);
  const failures = results.filter(
    (result): result is PromiseRejectedResult => result.status === "rejected",
  );

  return {
    successCount: results.length - failures.length,
    total: results.length,
    firstError: failures[0]?.reason,
  };
}

/** 전부 실패 → throw · 일부 실패 → throw (호출 전 invalidate 필요) */
export function assertBulkSettleResult(
  result: IBulkSettleResult,
  messages?: {
    partial?: (successCount: number, total: number) => string;
  },
): void {
  if (result.total === 0) return;

  if (result.successCount === 0) {
    if (
      result.firstError &&
      typeof result.firstError === "object" &&
      "message" in result.firstError
    ) {
      throw result.firstError;
    }
    throw new Error(
      result.firstError instanceof Error
        ? result.firstError.message
        : "요청에 실패했습니다.",
    );
  }

  if (result.successCount < result.total) {
    throw new Error(
      messages?.partial?.(result.successCount, result.total) ??
        `${result.total}개 중 ${result.successCount}개만 반영되었습니다.`,
    );
  }
}
