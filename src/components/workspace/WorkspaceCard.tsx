import React, { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

import type { TWorkspace } from "@/types/workspace/workspace";
import { ROLE_LABEL_MAP } from "@/constants/workspaceRole";

import BuildingIcon from "@/assets/icon/common/building.svg?react";
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

  return (
    <li className="block w-full">
      <button
        type="button"
        className={twMerge(
          "flex w-full items-center justify-between rounded-2xl border bg-surface-100 px-6 py-5 text-left shadow-Soft tablet:px-4 tablet:py-4 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:outline-none",
          onClick &&
            "cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1 hover:border-primary-400/30 hover:bg-primary-100/50 hover:shadow-Medium active:scale-[0.98]",
          isSelected
            ? "border-primary-500/40 bg-primary-100/50"
            : "border-surface-400 focus-within:border-primary-400/50",
        )}
        onClick={onClick}
      >
        <div className="flex items-center gap-5 min-w-0 tablet:gap-3">
          <div className="h-24 w-24 shrink-0 rounded-lg bg-surface-200 tablet:h-16 tablet:w-16">
            {showPlaceholder ? (
              <div className="w-full h-full flex items-center justify-center">
                <BuildingIcon className="w-8 h-8 text-text-placeholder" />
              </div>
            ) : (
              <img
                src={imageSrc}
                alt={`${w.name} 로고`}
                className="w-full h-full object-cover rounded-lg pointer-events-none"
                onError={() => {
                  setImageError(true);
                }}
              />
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <div className="truncate font-heading4 text-text-title">
                {w.name}
              </div>
              {isSelected && (
                <span
                  role="status"
                  className="shrink-0 rounded-full bg-primary-500/12 px-2 py-1 font-caption text-primary-500"
                >
                  현재 대시보드 기준
                </span>
              )}
            </div>

            <div className="mt-1 truncate font-body2 text-text-title">
              {w.description ?? ""}
            </div>
            <div className="mt-2 font-body1 text-text-muted">
              {ROLE_LABEL_MAP[w.myRole]}
            </div>
          </div>
        </div>
      </button>
    </li>
  );
}

export default React.memo(WorkspaceCard);
