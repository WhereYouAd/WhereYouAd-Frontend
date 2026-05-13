import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

import Button from "@/components/common/button/Button";

export type TModalDetailItem = {
  id: string | number;
  label: string;
};

interface IModalContentProps {
  icon?: ReactNode;
  title: string;
  description: string | ReactNode;
  /** 제목·설명 아래, 버튼 위에 스크롤 가능한 목록 (예: 대상 캠페인 이름) */
  detailItems?: readonly TModalDetailItem[];
  /** 목록 상단 라벨 (기본: 대상 캠페인) */
  detailListTitle?: string;
  buttonText: string;
  onConfirm: () => void;
  isLoading?: boolean;
  variant?: "danger" | "primary";
}

export default function ModalContent({
  icon,
  title,
  description,
  detailItems,
  detailListTitle = "대상 캠페인",
  buttonText,
  onConfirm,
  isLoading,
  variant = "danger",
}: IModalContentProps) {
  const iconShell =
    variant === "danger"
      ? "bg-info-red/8 ring-1 ring-info-red/15"
      : "bg-info-blue/8 ring-1 ring-info-blue/15";

  const hasList = detailItems && detailItems.length > 0;

  return (
    <div className="px-6 pb-8 pt-8 text-left tablet:px-5 tablet:pb-7 tablet:pt-7">
      <div className="flex flex-col gap-6">
        <div className="flex gap-4">
          {icon ? (
            <div
              className={twMerge(
                "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl",
                iconShell,
              )}
            >
              {icon}
            </div>
          ) : null}
          <div className="min-w-0 flex-1 space-y-2 pt-0.5">
            <h3 className="font-heading2 text-text-title leading-snug">
              {title}
            </h3>
            <div className="font-body1 leading-relaxed text-text-muted">
              {description}
            </div>
          </div>
        </div>

        {hasList ? (
          <div className="rounded-2xl border border-surface-400/45 bg-surface-200/40 p-3">
            <p className="font-caption text-text-muted px-1 pb-2 pt-0.5">
              {detailListTitle}
            </p>
            <ul
              className="max-h-44 space-y-1 overflow-y-auto overscroll-contain px-0.5 pb-0.5"
              role="list"
            >
              {detailItems!.map((item) => (
                <li
                  key={item.id}
                  className="truncate rounded-xl border border-surface-400/35 bg-surface-100 px-3 py-2.5 font-body2 text-text-title"
                >
                  {item.label}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="border-t border-surface-400/35 pt-1">
          <Button
            type="button"
            variant={variant}
            size="big"
            onClick={onConfirm}
            className="w-full cursor-pointer"
            disabled={isLoading}
          >
            {isLoading ? "처리 중.." : buttonText}
          </Button>
        </div>
      </div>
    </div>
  );
}
