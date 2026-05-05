import { useCallback } from "react";
import { toast } from "sonner";

const DEFAULT_MESSAGE =
  "해당 기능은 아직 준비 중이에요. 곧 이용하실 수 있어요!";

export function useComingSoon() {
  const showComingSoon = useCallback((message: string = DEFAULT_MESSAGE) => {
    toast.info(message, {
      id: "coming-soon",
      duration: 4000,
    });
  }, []);

  return { showComingSoon };
}
