import { useEffect } from "react";
import { createPortal } from "react-dom";
import { twMerge } from "tailwind-merge";

export type TToastVariant = "success" | "error";

export interface IToastProps {
  message: string;
  variant?: TToastVariant;
  duration?: number; // ms, 기본 2500
  onClose: () => void;
}

const variantClasses: Record<TToastVariant, string> = {
  success: "bg-[#1a1a1a] text-white",
  error: "bg-status-red text-white",
};

export default function Toast({
  message,
  variant = "success",
  duration = 2500,
  onClose,
}: IToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return createPortal(
    <div
      className={twMerge(
        "fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999]",
        "flex items-center gap-2 px-5 py-3 rounded-full shadow-lg",
        "font-pretendard font-body2 font-semibold text-sm tracking-tight",
        "animate-fade-in-up",
        variantClasses[variant],
      )}
      role="status"
      aria-live="polite"
    >
      {message}
    </div>,
    document.body,
  );
}
