import React, {
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { RemoveScroll } from "react-remove-scroll";
import { twMerge } from "tailwind-merge";

import CloseIcon from "@/assets/icon/common/close.svg?react";

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

const CLOSE_DURATION = 150; // --duration-fast 와 동일

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
  const titleId = useId();
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isClosing, setIsClosing] = useState(false);
  const isVisible = isOpen || isClosing; // 모달이 열려있거나 닫히는 중일 때

  // 진입/퇴장 렌더링 제어
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsClosing(false);
    } else {
      setIsClosing(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
        setIsClosing(false);
      }, CLOSE_DURATION);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // 포커스 관리: 모달 열릴 때 포커스 이동, 닫힘 애니메이션 종료 후 원래 위치로 복귀
  useEffect(() => {
    if (isVisible) {
      previousActiveElement.current = document.activeElement as HTMLElement;

      setTimeout(() => {
        modalRef.current?.focus();
      }, 0);
    } else {
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    }
  }, [isVisible]);

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

  if (!shouldRender) return null;

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
    // isVisible 기준으로 잠금: 닫힘 애니메이션 중에 배경 스크롤 막음
    <RemoveScroll enabled={isVisible}>
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 ${isClosing ? "animate-modal-overlay-out" : "animate-modal-overlay"}`}
        onClick={handleOverlayClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
      >
        <div
          ref={modalRef}
          className={twMerge(
            `relative bg-white rounded-component-md shadow-Medium w-full max-h-[90vh] overflow-auto ${isClosing ? "animate-modal-content-out" : "animate-modal-content"}`,
            sizeClasses[size],
            paddingClasses[padding],
            className,
          )}
          onClick={handleContentClick}
          tabIndex={-1}
        >
          {title && (
            <h2 id={titleId} className="sr-only">
              {title}
            </h2>
          )}
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
