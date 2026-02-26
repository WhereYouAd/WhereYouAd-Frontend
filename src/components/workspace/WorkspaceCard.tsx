import type { TWorkspace } from "@/types/workspace/workspace";

import {
  DropdownMenu,
  type TMenuItem,
} from "@/components/common/dropdownmenu/DropdownMenu";

import BuildingIcon from "@/assets/icon/workspace/building.svg?react";
import VectorIcon from "@/assets/icon/workspace/Vector.svg?react";

type TProps = {
  workspace: TWorkspace;
  menuItems: TMenuItem[];
};

export default function WorkspaceCard({ workspace: w, menuItems }: TProps) {
  return (
    <li className="flex items-center justify-between rounded-component-md bg-white px-6 py-5 shadow-sm border border-gray-100">
      <div className="flex items-center gap-5 min-w-0">
        <div className="w-20 h-20 bg-gray-100 shrink-0 rounded-component-sm">
          {/* TODO: 스타일 확인을 위해 bg-gray-100넣어둠. API연동할때 삭제예정 */}
          {w.logoUrl ? (
            <img
              src={w.logoUrl}
              alt={`${w.name} 로고`}
              className="w-full h-full object-cover rounded-component-sm"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BuildingIcon className="w-12 h-12" />
            </div>
          )}
        </div>

        <div className="min-w-0">
          <div className="font-heading4 text-text-main truncate">{w.name}</div>
          <div className="font-body1 text-text-main mt-1 truncate">
            {w.description ?? ""}
          </div>
          <div className="font-body1 text-text-sub mt-2">
            {w.myRole ?? "내 직책 및 역할"}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 shrink-0">
        <DropdownMenu
          trigger={<VectorIcon aria-hidden="true" />}
          aria-label={`${w.name} 워크스페이스 메뉴`}
          className="h-10 w-10 cursor-pointer rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center"
          items={menuItems}
        />
      </div>
    </li>
  );
}
