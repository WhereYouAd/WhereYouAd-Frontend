import type { ReactNode } from "react";
import { useEffect, useState } from "react";
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

  if (!isMounted) return null;

  return createPortal(
    <div
      data-drawer-portal
      className={twMerge(
        "fixed inset-0 z-50 flex justify-end transition-opacity duration-300",
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
        className={twMerge(
          "relative w-full rounded-l-4xl overflow-hidden max-w-md bg-white shadow-2xl h-full flex flex-col transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full",
          className,
        )}
      >
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
                    className="h-10 w-10 cursor-pointer rounded-component-sm hover:bg-gray-100 transition-colors flex items-center justify-center outline-none"
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
                  className="h-10 w-10 cursor-pointer rounded-component-sm hover:bg-gray-100 transition-colors flex items-center justify-center outline-none"
                  aria-label="닫기"
                >
                  <CloseIcon className="text-text-disabled" />
                </button>
                {dropdownItems && (
                  <DropdownMenu
                    trigger={<MoreIcon className="text-text-disabled" />}
                    aria-label="더보기"
                    className="h-10 w-10 cursor-pointer rounded-component-sm hover:bg-gray-100 transition-colors flex items-center justify-center"
                    items={dropdownItems}
                  />
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
