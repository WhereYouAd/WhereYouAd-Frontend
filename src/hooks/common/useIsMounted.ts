import { useEffect, useState } from "react";

// 클라이언트 마운트 여부 반환 (SSR 환경에서 클라이언트 전용 렌더링 제어용)
export function useIsMounted() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted;
}
