import type React from "react";

import type { TProviderType } from "@/types/dashboard/provider";

import GoogleLogo from "@/assets/logo/social-logo/circle/google-circle.svg?react";
import MetaLogo from "@/assets/logo/social-logo/circle/meta-circle.svg?react";
import NaverLogo from "@/assets/logo/social-logo/circle/naver-circle.svg?react";

export const PLATFORM_CIRCLE_LOGO_MAP: Record<
  TProviderType,
  React.FC<React.SVGProps<SVGSVGElement>>
> = {
  GOOGLE: GoogleLogo,
  NAVER: NaverLogo,
  META: MetaLogo,
};
