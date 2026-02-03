import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type TUseTimerOptions = {
  autoStart?: boolean;
  onExpire?: () => void;
};

export const useTimer = (
  initialTime: number,
  options: TUseTimerOptions = {},
) => {
  const { autoStart = false, onExpire } = options;

  const [timeLeft, setTimeLeft] = useState(() => Math.max(0, initialTime));
  const [isActive, setIsActive] = useState(autoStart);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onExpireRef = useRef<TUseTimerOptions["onExpire"]>(onExpire);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  const clear = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!isActive) {
      clear();
      return;
    }

    if (timeLeft <= 0) {
      setIsActive(false);
      clear();
      onExpireRef.current?.();
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return clear;
  }, [isActive, timeLeft, clear]);

  // 언마운트 시에 정리
  useEffect(() => clear, [clear]);

  const start = useCallback(() => {
    setIsActive(true);
  }, []);

  const stop = useCallback(() => {
    setIsActive(false);
  }, []);

  const reset = useCallback(() => {
    setIsActive(false);
    setTimeLeft(Math.max(0, initialTime));
  }, [initialTime]);

  const restart = useCallback(() => {
    setTimeLeft(Math.max(0, initialTime));
    setIsActive(true);
  }, [initialTime]);

  const formattedTime = useMemo(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }, [timeLeft]);

  return {
    timeLeft,
    formattedTime,
    isActive,
    isExpired: timeLeft <= 0,
    start,
    stop,
    reset,
    restart,
  };
};
