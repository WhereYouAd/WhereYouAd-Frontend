import React, {
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { RemoveScroll } from "react-remove-scroll";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { twMerge } from "tailwind-merge";

import CloseIcon from "@/assets/icon/common/close.svg?react";

const FOCUSABLE_SELECTORS = [
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "a[href]",
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

function getFocusable(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS),
  ).filter(
    (el) =>
      el.tabIndex >= 0 &&
      el.getClientRects().length > 0 &&
      getComputedStyle(el).visibility !== "hidden" &&
      !el.closest('[aria-hidden="true"]') &&
      !el.closest("[inert]"),
  );
}

export interface IModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  padding?: "none" | "sm" | "md" | "lg";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  hideCloseButton?: boolean;
  disableOverlayClick?: boolean;
  title?: string;
  onExitComplete?: () => void;
}

const easeOut = [0, 0, 0.2, 1] as const;
const easeIn = [0.4, 0, 1, 1] as const;

function Modal({
  isOpen,
  onClose,
  children,
  padding = "md",
  size = "md",
  className,
  hideCloseButton = false,
  disableOverlayClick = false,
  title,
  onExitComplete,
}: IModalProps) {
  const reduceMotion = useReducedMotion();
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const [scrollLocked, setScrollLocked] = useState(isOpen);

  useEffect(() => {
    if (isOpen) setScrollLocked(true);
  }, [isOpen]);

  useLayoutEffect(() => {
    if (!isOpen) return;
    previousActiveElement.current = document.activeElement as HTMLElement;
    const id = requestAnimationFrame(() => {
      const first = modalRef.current
        ? getFocusable(modalRef.current)[0]
        : undefined;
      (first ?? modalRef.current)?.focus();
    });
    return () => cancelAnimationFrame(id);
  }, [isOpen]);

  const handleExitComplete = useCallback(() => {
    setScrollLocked(false);
    previousActiveElement.current?.focus();
    onExitComplete?.();
  }, [onExitComplete]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key !== "Tab") return;
      const focusable = modalRef.current ? getFocusable(modalRef.current) : [];
      if (focusable.length === 0) {
        e.preventDefault();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [],
  );

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // mousedown으로 닫아야 드롭다운 축소 후 따라오는 click이 오버레이에
  // 떨어져 모달이 같이 닫히는 문제를 막을 수 있음
  const handleOverlayMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (disableOverlayClick) return;
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [disableOverlayClick, onClose],
  );

  const handleContentMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
    },
    [],
  );

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  const paddingClasses = {
    none: "p-0",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  const modalRoot = document.getElementById("modal-root");
  if (!modalRoot) {
    console.warn("모달 루트 요소를 찾을 수 없습니다");
    return null;
  }

  const openMs = reduceMotion ? 0 : 0.25;
  const closeMs = reduceMotion ? 0 : 0.15;

  return createPortal(
    <RemoveScroll enabled={scrollLocked}>
      <AnimatePresence onExitComplete={handleExitComplete}>
        {isOpen ? (
          <motion.div
            key="modal-layer"
            className="fixed inset-0 z-50 flex items-center justify-center bg-text-400/50"
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? titleId : undefined}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{
              opacity: 0,
              transition: { duration: closeMs, ease: easeIn },
            }}
            transition={{ duration: openMs, ease: easeOut }}
            onMouseDown={handleOverlayMouseDown}
          >
            <motion.div
              ref={modalRef}
              className={twMerge(
                "relative mx-4 w-full max-h-[90vh] overflow-auto rounded-2xl bg-surface-100 shadow-Soft",
                sizeClasses[size],
                paddingClasses[padding],
                // absolute 닫기 버튼(top-4 right-4)과 본문 겹침 방지
                !hideCloseButton && "pr-12",
                className,
              )}
              initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{
                opacity: 0,
                scale: reduceMotion ? 1 : 0.95,
                transition: { duration: closeMs, ease: easeIn },
              }}
              transition={{ duration: openMs, ease: easeOut }}
              onMouseDown={handleContentMouseDown}
              onKeyDown={handleKeyDown}
              tabIndex={-1}
            >
              {title ? (
                <h2 id={titleId} className="sr-only">
                  {title}
                </h2>
              ) : null}
              {!hideCloseButton ? (
                <button
                  type="button"
                  onClick={onClose}
                  className="absolute top-4 right-4 z-10 rounded-full p-1 transition-colors hover:bg-surface-200"
                  aria-label="모달 닫기"
                >
                  <CloseIcon className="h-6 w-6 text-text-muted" />
                </button>
              ) : null}
              {children}
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </RemoveScroll>,
    modalRoot,
  );
}

export default Modal;
