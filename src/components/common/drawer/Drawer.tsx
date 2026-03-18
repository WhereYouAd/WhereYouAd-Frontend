import type { ReactNode, TouchEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { twMerge } from "tailwind-merge";

import { DropdownMenu } from "@/components/common/dropdownmenu/DropdownMenu";

import CloseIcon from "@/assets/icon/common/close.svg?react";
import MoreIcon from "@/assets/icon/common/more.svg?react";

export interface IDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: ReactNode;
  children: ReactNode;
  className?: string;
  hideHeader?: boolean;
  dropdownItems?: { label: string; icon?: ReactNode; onClick: () => void }[];
  disableScroll?: boolean;
}

const TABLET_MQ = "(max-width: 1024px)";
const SWIPE_CLOSE_THRESHOLD = 80;

export default function Drawer({
  isOpen,
  onClose,
  title,
  children,
  className,
  hideHeader = false,
  dropdownItems,
  disableScroll = false,
}: IDrawerProps) {
  const [isMounted, setIsMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);
  const isDragging = useRef(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // isOpen 변경 시 인라인 transform 초기화 (스와이프 후 닫힐 때 CSS transition이 올바르게 동작하도록)
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    panel.style.transform = "";
    panel.style.transition = "";
  }, [isOpen]);

  const handleTouchStart = (e: TouchEvent) => {
    if (!window.matchMedia(TABLET_MQ).matches) return;
    touchStartY.current = e.touches[0].clientY;
    isDragging.current = true;
    if (panelRef.current) {
      panelRef.current.style.transition = "none";
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging.current || !panelRef.current) return;
    const delta = e.touches[0].clientY - touchStartY.current;
    if (delta < 0) return;
    panelRef.current.style.transform = `translateY(${delta}px)`;
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (!isDragging.current || !panelRef.current) return;
    isDragging.current = false;
    const delta = e.changedTouches[0].clientY - touchStartY.current;
    panelRef.current.style.transition = "";

    if (delta > SWIPE_CLOSE_THRESHOLD) {
      panelRef.current.style.transform = "";
      onClose();
    } else {
      panelRef.current.style.transform = "";
    }
  };

  if (!isMounted) return null;

  return createPortal(
    <div
      data-drawer-portal
      className={twMerge(
        "fixed inset-0 z-50 flex justify-end tablet:items-end transition-opacity duration-300",
        isOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none",
      )}
    >
      <div
        data-print-hide
        className="absolute inset-0 bg-black/40 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        className={twMerge(
          // [데스크톱] 우측 슬라이드
          "relative w-full rounded-l-4xl overflow-hidden max-w-md bg-white shadow-2xl h-full flex flex-col transform transition-transform duration-300 ease-in-out",
          // [태블릿] 하단 bottom sheet
          "tablet:rounded-t-4xl tablet:h-auto tablet:max-h-[85vh] tablet:max-w-none tablet:border-t tablet:border-bg-disabled",
          isOpen
            ? "translate-x-0 tablet:translate-y-0"
            : "translate-x-full tablet:translate-x-0 tablet:translate-y-full",
          className,
        )}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* 태블릿 드래그 핸들 */}
        <div className="hidden tablet:flex justify-center pt-3 pb-1 shrink-0 cursor-grab active:cursor-grabbing">
          <div className="w-20 h-1 rounded-full bg-bg-disabled" />
        </div>

        {!hideHeader && (
          <div
            data-print-hide
            className="flex items-center justify-between px-6 pt-4 pb-4 shrink-0"
          >
            {title ? (
              <>
                {typeof title === "string" ? (
                  <h2 className="font-heading3 text-text-main font-bold">
                    {title}
                  </h2>
                ) : (
                  title
                )}
                <div className="flex items-center gap-1">
                  {dropdownItems && dropdownItems.length > 0 && (
                    <DropdownMenu
                      trigger={<MoreIcon className="text-text-disabled" />}
                      aria-label="더보기"
                      className="h-10 w-10 cursor-pointer rounded-component-sm hover:bg-gray-100 transition-colors flex items-center justify-center"
                      items={dropdownItems}
                    />
                  )}
                  <button
                    onClick={onClose}
                    className="tablet:hidden h-10 w-10 cursor-pointer rounded-component-sm hover:bg-gray-100 transition-colors flex items-center justify-center outline-none"
                    aria-label="닫기"
                  >
                    <CloseIcon className="text-text-disabled" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={onClose}
                  className="tablet:hidden h-10 w-10 cursor-pointer rounded-component-sm hover:bg-gray-100 transition-colors flex items-center justify-center outline-none"
                  aria-label="닫기"
                >
                  <CloseIcon className="text-text-disabled" />
                </button>
                {dropdownItems && (
                  <div className="ml-auto">
                    <DropdownMenu
                      trigger={<MoreIcon className="text-text-disabled" />}
                      aria-label="더보기"
                      className="h-10 w-10 cursor-pointer rounded-component-sm hover:bg-gray-100 transition-colors flex items-center justify-center"
                      items={dropdownItems}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        )}
        <div
          className={twMerge(
            "flex-1 p-6 bg-white",
            disableScroll ? "overflow-hidden" : "overflow-y-auto",
          )}
        >
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
}
