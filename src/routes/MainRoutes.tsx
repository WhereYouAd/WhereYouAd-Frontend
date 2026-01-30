import { lazy } from "react";
import type { RouteObject } from "react-router-dom";

const OverviewDashboard = lazy(
  () => import("@/pages/dashboard/overview/OverviewDashboard"),
);
const PlatformDashboard = lazy(
  () => import("@/pages/dashboard/platform/PlatformDashboard"),
);
const Timeline = lazy(() => import("@/pages/dashboard/timeline/Timeline"));
const AdsListPage = lazy(() => import("@/pages/ads/list/AdsListPage"));
const AdsCreatePage = lazy(() => import("@/pages/ads/new/AdsCreatePage"));

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
];

export default MainRoutes;
