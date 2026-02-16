import type { ComponentType, SVGProps } from "react";

export interface INavItem {
  id: string;
  label: string;
  path?: string;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  children?: INavItem[];
}
