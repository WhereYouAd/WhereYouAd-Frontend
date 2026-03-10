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
    path: "/",
    children: [
      {
        id: "dashboard-integrated",
        label: "통합 대시보드",
        path: "/",
      },
      {
        id: "dashboard-platform",
        label: "플랫폼별 대시보드",
        path: "/platform",
      },
      {
        id: "dashboard-timeline",
        label: "성과 타임라인",
        path: "/timeline",
      },
    ],
  },
  {
    id: "ads",
    label: "광고",
    icon: AdsIcon,
    path: "/ads",
    children: [
      {
        id: "ads-list",
        label: "광고 목록",
        path: "/ads",
      },
      {
        id: "ads-campaign-group",
        label: "캠페인 그룹 정보 설정",
        path: "/ads/campaignGroup",
      },
    ],
  },
  {
    id: "map",
    label: "지도",
    icon: MapIcon,
    // path: "/map",
  },
  {
    id: "workspace",
    label: "워크스페이스",
    icon: WorkspaceIcon,
    path: "/workspace",
    children: [
      {
        id: "workspace-billing",
        label: "플랜 및 결제",
        path: "/workspace/billing",
      },
    ],
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
    path: "/setting",
    icon: SettingsIcon,
  },
  {
    id: "logout",
    label: "로그아웃",
    icon: LogoutIcon,
  },
];
