import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

import Button from "@/components/common/button/Button";
import Input from "@/components/common/input/Input";

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
  /** 이 문자열과 입력값이 정확히 일치할 때만 확인 버튼 활성화 (GitHub 스타일) */
  confirmMatchText?: string;
  confirmInput?: string;
  onConfirmInputChange?: (value: string) => void;
  /** 확인 입력란 위 안내 문단. `false`이면 문단을 렌더하지 않음(기본 문구도 생략). */
  confirmMatchSubheading?: ReactNode | false;
  /** 확인 입력란 placeholder. 미지정 시 `confirmMatchText`와 동일하게 사용. */
  confirmMatchInputPlaceholder?: string;
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
  confirmMatchText,
  confirmInput,
  onConfirmInputChange,
  confirmMatchSubheading,
  confirmMatchInputPlaceholder,
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

  const hasConfirmMatch =
    confirmMatchText !== undefined &&
    confirmInput !== undefined &&
    onConfirmInputChange !== undefined;

  const confirmMismatch =
    hasConfirmMatch &&
    (confirmInput!.trim() !== confirmMatchText ||
      confirmMatchText.length === 0);

  const showMutedDangerConfirm =
    hasConfirmMatch && confirmMismatch && !isLoading;

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
          <div className="min-w-0 flex-1 space-y-2.5 pt-0.5">
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

        {hasConfirmMatch ? (
          <div className="space-y-3 rounded-2xl border border-surface-400/45 bg-surface-200/40 p-4 tablet:p-3.5">
            {confirmMatchSubheading !== false ? (
              <p className="font-body2 leading-snug text-text-title">
                {confirmMatchSubheading ??
                  "삭제를 확인하려면 아래 이름을 한 글자도 바꾸지 않고 입력하세요."}
              </p>
            ) : null}
            <div className="rounded-xl border border-surface-400/50 bg-surface-100 px-3 py-2.5">
              <p className="font-caption text-text-muted">확인용 이름</p>
              <p className="mt-0.5 break-all font-label text-text-title">
                {confirmMatchText}
              </p>
            </div>
            <Input
              label=""
              value={confirmInput}
              onChange={(e) => onConfirmInputChange!(e.target.value)}
              placeholder={
                confirmMatchInputPlaceholder ?? confirmMatchText ?? ""
              }
              autoComplete="off"
              disabled={isLoading}
              aria-label="워크스페이스 이름 확인 입력"
              containerClassName="mt-0"
              inputClassName="font-body2"
            />
          </div>
        ) : null}

        <div className="border-t border-surface-400/35 pt-4">
          <Button
            type="button"
            variant={variant}
            size="big"
            onClick={onConfirm}
            className={twMerge(
              "w-full",
              showMutedDangerConfirm &&
                variant === "danger" &&
                "cursor-not-allowed! border! border-info-red/45! bg-info-red/12! text-info-red! opacity-100! shadow-none hover:border-info-red/55! hover:bg-info-red/18! disabled:hover:border-info-red/45! disabled:hover:bg-info-red/12!",
            )}
            disabled={isLoading || confirmMismatch}
          >
            {isLoading ? "처리 중.." : buttonText}
          </Button>
        </div>
      </div>
    </div>
  );
}
