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
          "w-full text-left flex items-center justify-between rounded-component-md bg-white px-6 py-5 shadow-Soft border tablet:px-4 tablet:py-4 focus-visible:ring-2 focus-visible:ring-chart-3 focus-visible:outline-none",
          onClick &&
            "cursor-pointer hover:bg-chart-3/5 hover:-translate-y-1 hover:shadow-Medium hover:border-chart-3/30 active:scale-[0.98] transition-all duration-300 ease-out",
          isSelected
            ? "border-chart-3/80 bg-chart-3/5"
            : "border-gray-100 focus-within:border-chart-3/50",
        )}
        onClick={onClick}
      >
        <div className="flex items-center gap-5 min-w-0 tablet:gap-3">
          <div className="w-24 h-24 bg-gray-100 shrink-0 rounded-component-sm tablet:h-16 tablet:w-16">
            {showPlaceholder ? (
              <div className="w-full h-full flex items-center justify-center">
                <BuildingIcon className="w-8 h-8 text-text-placeholder" />
              </div>
            ) : (
              <img
                src={imageSrc}
                alt={`${w.name} 로고`}
                className="w-full h-full object-cover rounded-component-sm pointer-events-none"
                onError={() => {
                  setImageError(true);
                }}
              />
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <div className="font-heading4 font-semibold! text-text-main truncate">
                {w.name}
              </div>
              {isSelected && (
                <span
                  role="status"
                  className="shrink-0 rounded-full bg-chart-3/12 px-2 py-1 font-caption text-chart-3"
                >
                  현재 대시보드 기준
                </span>
              )}
            </div>

            <div className="font-body2 text-text-main mt-1 truncate">
              {w.description ?? ""}
            </div>
            <div className="font-body1 text-text-sub mt-2">
              {ROLE_LABEL_MAP[w.myRole]}
            </div>
          </div>
        </div>
      </button>
    </li>
  );
}

export default React.memo(WorkspaceCard);
