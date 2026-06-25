import { QueryClient } from "@tanstack/react-query";

import type { IApiErrorResponse } from "@/types/common/common";

// 4xx: 클라이언트 오류는 재시도해도 결과가 동일하므로 즉시 실패
// 5xx: 서버 일시 오류는 1회 재시도 허용
// axiosInstance 인터셉터가 401 재발급을 별도로 처리하므로 중복 재시도 방지
const retryPolicy = (failureCount: number, error: unknown): boolean => {
  const status = Number((error as IApiErrorResponse)?.status);
  if (Number.isFinite(status) && status >= 400 && status < 500) return false;
  return failureCount < 1;
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: retryPolicy,
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
  },
});
