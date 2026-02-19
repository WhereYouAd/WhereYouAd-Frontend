import type { ComponentType, SVGProps } from "react";

export interface INavItem {
  id: string;
  label: string;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  path?: string;
  children?: INavItem[];
}
