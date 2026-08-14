import React, { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

import type { TWorkspace } from "@/types/workspace/workspace";
import { ROLE_LABEL_MAP } from "@/constants/workspaceRole";

import Badge from "@/components/common/badge/Badge";

import ChevronRightIcon from "@/assets/icon/chevron/chevron-right.svg?react";
import { getImageUrl } from "@/lib/getImageUrl";

type TProps = {
  workspace: TWorkspace;
  isSelected?: boolean;
  onClick?: () => void;
};

function WorkspaceCard({ workspace: w, isSelected = false, onClick }: TProps) {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [w.logoUrl]);

  const imageSrc = w.logoUrl ? getImageUrl(w.logoUrl) : null;
  const showPlaceholder = !imageSrc || imageError;
  const initial = (w.name.trim()[0] ?? "?").toUpperCase();

  return (
    <li className="block h-full">
      <button
        type="button"
        className={twMerge(
          "group relative flex h-full min-h-52 w-full flex-col rounded-2xl border-[1.5px] bg-surface-100 p-6 text-left shadow-Soft",
          "focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:outline-none",
          "tablet:min-h-48 tablet:p-5",
          onClick &&
            "cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1 hover:border-primary-400/30 hover:bg-primary-100/35 active:scale-[0.98]",
          isSelected
            ? "border-primary-400 bg-primary-100/55 ring-2 ring-primary-400/30"
            : "border-surface-400",
        )}
        onClick={onClick}
      >
        {isSelected && (
          <span
            role="status"
            className="absolute top-5 right-5 shrink-0 rounded-full bg-primary-500/85 px-2.5 py-1 font-caption text-surface-100"
          >
            현재 기준
          </span>
        )}

        <div
          className={twMerge(
            "mb-5 flex h-18 w-18 items-center justify-center overflow-hidden rounded-2xl",
            "tablet:mb-4 tablet:h-14 tablet:w-14",
            showPlaceholder
              ? "bg-primary-100 text-primary-500"
              : "bg-surface-200",
          )}
        >
          {showPlaceholder ? (
            <span className="font-heading3">{initial}</span>
          ) : (
            <img
              src={imageSrc}
              alt={`${w.name} 로고`}
              className="h-full w-full object-cover pointer-events-none"
              onError={() => setImageError(true)}
            />
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="pr-12">
            <div
              className={twMerge(
                "truncate font-heading4",
                isSelected ? "text-surface-500" : "text-text-title",
              )}
            >
              {w.name}
            </div>

            {w.description ? (
              <p className="mt-1.5 line-clamp-2 font-body2 text-text-muted">
                {w.description}
              </p>
            ) : (
              <p className="mt-1.5 font-body2 text-text-placeholder">
                설명이 없습니다
              </p>
            )}
          </div>

          <div className="mt-auto flex items-center pt-5 pr-8">
            <Badge
              variant={w.myRole === "ADMIN" ? "infoBlue" : "surface"}
              className="h-6 px-2"
            >
              {ROLE_LABEL_MAP[w.myRole]}
            </Badge>
          </div>
        </div>

        <ChevronRightIcon
          aria-hidden
          className={twMerge(
            "pointer-events-none absolute right-5 bottom-6 h-5 w-5 transition-all duration-300 ease-out tablet:bottom-5 tablet:right-4",
            isSelected
              ? "text-primary-500"
              : "text-text-muted group-hover:text-primary-500",
          )}
        />
      </button>
    </li>
  );
}

export default React.memo(WorkspaceCard);
