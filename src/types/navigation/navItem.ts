import type { ComponentType, SVGProps } from "react";

export interface INavItem {
  id: string;
  label: string;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  path?: string;
  /** `/workspace/{id}/{workspaceSubpath}` — `path`와 동시에 쓰지 않음 */
  workspaceSubpath?: string;
  /** true면 `path`와 pathname이 정확히 일치할 때만 매칭 (워크스페이스 목록 등) */
  pathExact?: boolean;
  children?: INavItem[];
}
