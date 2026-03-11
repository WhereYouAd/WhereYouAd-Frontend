import { lazy } from "react";
import type { RouteObject } from "react-router-dom";

import { loadable } from "@/utils/loadable";

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
const Workspace = loadable(lazy(() => import("@/pages/workspace/Workspace")));
const WorkspaceSetting = loadable(
  lazy(() => import("@/pages/workspace/WorkspaceSetting")),
);
const Billing = loadable(lazy(() => import("@/pages/workspace/Billing")));

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
    path: "ads/:id",
    element: <CampaignDetail />,
  },

  {
    path: "workspace/:workspaceId/settings",
    element: <WorkspaceSetting />,
  },
  {
    path: "workspace",
    element: <Workspace />,
  },
  {
    path: "workspace/billing",
    element: <Billing />,
  },
];

export default MainRoutes;
