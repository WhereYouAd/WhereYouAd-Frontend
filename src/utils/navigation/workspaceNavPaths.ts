import type { INavItem } from "@/types/navigation/navItem";

import { isPathMatch, normalizePathname } from "@/utils/navigation/pathMatch";

/** 선택된 워크스페이스(org) id로 워크스페이스 하위 메뉴 `path`를 채움 */
export function applyWorkspacePathsToNav(
  items: INavItem[],
  workspaceId: number | null,
): INavItem[] {
  return items.map((item) => {
    if (item.id !== "workspace" || !item.children) return item;
    return {
      ...item,
      children: item.children.map((c) => {
        if (!c.workspaceSubpath) return c;
        const path =
          workspaceId != null
            ? `/workspace/${workspaceId}/${c.workspaceSubpath}`
            : "/workspace";
        return { ...c, path };
      }),
    };
  });
}

/** 브레드크럼·활성 표시용: 단일 내비 항목이 pathname과 맞는지 */
export function navItemMatchesPath(item: INavItem, pathname: string): boolean {
  const norm = normalizePathname(pathname);
  if (item.pathExact && item.path) {
    return normalizePathname(item.path) === norm;
  }
  if (item.workspaceSubpath) {
    return new RegExp(`^/workspace/[^/]+/${item.workspaceSubpath}$`).test(norm);
  }
  if (item.path) {
    return isPathMatch(norm, item.path);
  }
  return false;
}
