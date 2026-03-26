import React, { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

import type { TWorkspace } from "@/types/workspace/workspace";
import { ROLE_LABEL_MAP } from "@/constants/workspaceRole";

import {
  DropdownMenu,
  type TMenuItem,
} from "@/components/common/dropdownmenu/DropdownMenu";

import BuildingIcon from "@/assets/icon/common/building.svg?react";
import VectorIcon from "@/assets/icon/common/more.svg?react";
import { getImageUrl } from "@/lib/getImageUrl";

type TProps = {
  workspace: TWorkspace;
  menuItems: TMenuItem[];
  isSelected?: boolean;
  onClick?: () => void;
};

function WorkspaceCard({
  workspace: w,
  menuItems,
  isSelected = false,
  onClick,
}: TProps) {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [w.logoUrl]);

  const imageSrc = w.logoUrl ? getImageUrl(w.logoUrl) : null;
  const showPlaceholder = !imageSrc || imageError;

  return (
    <li
      className={twMerge(
        "flex items-center justify-between rounded-component-md bg-white px-6 py-5 shadow-Soft border tablet:px-4 tablet:py-4",
        onClick &&
          "cursor-pointer hover:bg-gray-50 active:scale-93 duration-50 transition-transform",
        isSelected ? "border-chart-3/80 bg-chart-3/2" : "border-gray-100",
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
              className="w-full h-full object-cover rounded-component-sm"
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

      <div
        className="flex items-center gap-4 shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <DropdownMenu
          trigger={<VectorIcon aria-hidden="true" />}
          aria-label={`${w.name} 워크스페이스 메뉴`}
          className="h-10 w-10 cursor-pointer rounded-component-sm hover:bg-gray-100 transition-colors flex items-center justify-center"
          items={menuItems}
        />
      </div>
    </li>
  );
}

export default React.memo(WorkspaceCard);
