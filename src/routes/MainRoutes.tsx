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
const AdsCreatePage = loadable(
  lazy(() => import("@/pages/ads/new/AdsCreatePage")),
);
const Setting = loadable(lazy(() => import("@/pages/setting/Setting")));
const Workspace = loadable(lazy(() => import("@/pages/workspace/Workspace")));

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
    path: "ads/create",
    element: <AdsCreatePage />,
  },
  {
    path: "setting",
    element: <Setting />,
  },
  {
    path: "workspace",
    element: <Workspace />,
  },
];

export default MainRoutes;
