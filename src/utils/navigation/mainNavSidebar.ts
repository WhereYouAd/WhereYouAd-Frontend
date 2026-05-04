import type { INavItem } from "@/types/navigation/navItem";
import { mainNav } from "@/constants/sidebarNav";

import { isPathMatch, normalizePathname } from "./pathMatch";

function createMainNavSidebarHelpers() {
  const childIdToParentId = new Map<string, string>();
  const childPathToParentId = new Map<string, string>();

  for (const parent of mainNav) {
    for (const child of parent.children ?? []) {
      childIdToParentId.set(child.id, parent.id);
      if (child.path) {
        childPathToParentId.set(normalizePathname(child.path), parent.id);
      }
    }
  }

  const childPathEntries = Array.from(childPathToParentId.entries()).sort(
    ([a], [b]) => b.length - a.length,
  );

  function resolveParentId(pathname: string): string | undefined {
    return (
      childPathToParentId.get(pathname) ??
      childPathEntries.find(([p]) => isPathMatch(pathname, p))?.[1]
    );
  }

  function getItemActiveState(pathname: string, item: INavItem) {
    const isChildActive =
      item.children?.some((c) =>
        c.path ? isPathMatch(pathname, c.path) : false,
      ) ?? false;

    const isParentActive =
      (item.path ? isPathMatch(pathname, item.path) : false) || isChildActive;

    return { isChildActive, isParentActive };
  }

  return { childIdToParentId, resolveParentId, getItemActiveState };
}

export const mainNavSidebar = createMainNavSidebarHelpers();
