import React, { type ReactNode, useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { RemoveScroll } from "react-remove-scroll";
import { twMerge } from "tailwind-merge";

import CloseIcon from "@/assets/icon/x-icon.svg?react";

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
}

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
}: IModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // 포커스 관리: 모달 열릴 때 포커스 이동, 닫힐 때 원래 위치로 복귀
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;

      setTimeout(() => {
        modalRef.current?.focus();
      }, 0);
    } else {
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    }
  }, [isOpen]);

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // 오버레이 클릭으로 닫기
  const handleOverlayClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (disableOverlayClick) return;
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [disableOverlayClick, onClose],
  );

  const handleContentClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
    },
    [],
  );

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-modal-sm",
    md: "max-w-modal-md",
    lg: "max-w-modal-lg",
    xl: "max-w-modal-xl",
  };

  const paddingClasses = {
    none: "p-modal-none",
    sm: "p-modal-sm",
    md: "p-modal-md",
    lg: "p-modal-lg",
  };

  const modalRoot = document.getElementById("modal-root");
  if (!modalRoot) {
    console.warn("모달 루트 요소를 찾을 수 없습니다");
    return null;
  }

  return createPortal(
    <RemoveScroll enabled={isOpen}>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-modal-overlay"
        onClick={handleOverlayClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
      >
        <div
          ref={modalRef}
          className={twMerge(
            "relative bg-white rounded-component-md shadow-xl w-full max-h-[90vh] overflow-auto animate-modal-content",
            sizeClasses[size],
            paddingClasses[padding],
            className,
          )}
          onClick={handleContentClick}
          tabIndex={-1}
        >
          {!hideCloseButton && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="모달 닫기"
            >
              <CloseIcon className="w-6 h-6 text-gray-600" />
            </button>
          )}
          {children}
        </div>
      </div>
    </RemoveScroll>,
    modalRoot,
  );
}

export default Modal;
