import { lazy } from "react";
import type { RouteObject } from "react-router-dom";

import { loadable } from "@/utils/loadable";

import WorkspaceListLoading from "@/components/workspace/WorkspaceListLoading";

const OverviewDashboard = loadable(
  lazy(() => import("@/pages/dashboard/overview/OverviewDashboard")),
);
const PlatformDashboard = loadable(
  lazy(() => import("@/pages/dashboard/platform/PlatformDashboard")),
);
const Timeline = loadable(
  lazy(() => import("@/pages/dashboard/timeline/Timeline")),
);
const AdsListPage = loadable(
  lazy(() => import("@/pages/ads/list/AdsListPage")),
);
const CampaignDetail = loadable(
  lazy(() => import("@/pages/ads/list/CampaignDetail")),
);
const CampaignGroup = loadable(
  lazy(() => import("@/pages/ads/new/CampaignGroup")),
);
const Workspace = loadable(
  lazy(() => import("@/pages/workspace/Workspace")),
  <WorkspaceListLoading />,
);
const WorkspaceManageLayout = loadable(
  lazy(() => import("@/layout/workspace/WorkspaceManageLayout")),
);
const WorkspaceSetting = loadable(
  lazy(() => import("@/pages/workspace/WorkspaceSetting")),
);
const MemberManagement = loadable(
  lazy(() => import("@/pages/workspace/MemberManagement")),
);
const Billing = loadable(lazy(() => import("@/pages/workspace/Billing")));

const Setting = loadable(lazy(() => import("@/pages/setting/Setting")));

const MainRoutes: RouteObject[] = [
  {
    path: "/",
    element: <OverviewDashboard />,
  },
  {
    path: "platform",
    element: <PlatformDashboard />,
  },
  {
    path: "timeline",
    element: <Timeline />,
  },
  {
    path: "ads",
    element: <AdsListPage />,
  },
  {
    path: "ads/campaignGroup",
    element: <CampaignGroup />,
  },
  {
    path: "ads/:orgId/:projectId",
    element: <CampaignDetail />,
  },

  {
    path: "workspace",
    element: <Workspace />,
  },
  {
    path: "workspace/:workspaceId",
    element: <WorkspaceManageLayout />,
    children: [
      { path: "settings", element: <WorkspaceSetting /> },
      { path: "members", element: <MemberManagement /> },
    ],
  },
  {
    path: "workspace/billing",
    element: <Billing />,
  },
  {
    path: "setting",
    element: <Setting />,
  },
];

export default MainRoutes;
