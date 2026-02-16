import type { INavItem } from "@/types/navigation/navItem";

import AdsIcon from "@/assets/icon/sidebar/ads.svg?react";
import DashboardIcon from "@/assets/icon/sidebar/dashboard.svg?react";
import LogoutIcon from "@/assets/icon/sidebar/logout.svg?react";
import MapIcon from "@/assets/icon/sidebar/map.svg?react";
import NotificationIcon from "@/assets/icon/sidebar/notification.svg?react";
import SettingsIcon from "@/assets/icon/sidebar/setting.svg?react";
import WorkspaceIcon from "@/assets/icon/sidebar/workspace.svg?react";

export const mainNav: INavItem[] = [
  {
    id: "dashboard",
    label: "대시보드",
    icon: DashboardIcon,
    children: [
      {
        id: "dashboard-integrated",
        label: "통합 대시보드",
        path: "/dashboard/integrated",
      },
      {
        id: "dashboard-platform",
        label: "플랫폼별 대시보드",
        path: "/dashboard/platform",
      },
      {
        id: "dashboard-timeline",
        label: "성과 타임라인",
        path: "/dashboard/timeline",
      },
    ],
  },
  {
    id: "ads",
    label: "광고",
    path: "/ads",
    icon: AdsIcon,
  },
  {
    id: "map",
    label: "지도",
    path: "/map",
    icon: MapIcon,
  },
  {
    id: "workspace",
    label: "워크스페이스",
    path: "/workspace",
    icon: WorkspaceIcon,
  },
];

export const footerNav: INavItem[] = [
  {
    id: "notifications",
    label: "알림",
    icon: NotificationIcon,
  },
  {
    id: "settings",
    label: "설정",
    path: "/settings",
    icon: SettingsIcon,
  },
  {
    id: "logout",
    label: "로그아웃",
    icon: LogoutIcon,
  },
];
