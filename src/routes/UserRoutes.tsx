import { lazy } from "react";
import type { RouteObject } from "react-router-dom";

const Setting = lazy(() => import("@/pages/setting/Setting"));
const Workspace = lazy(() => import("@/pages/workspace/Workspace"));

const UserRoutes: RouteObject[] = [
  {
    path: "setting",
    element: <Setting />,
  },
  {
    path: "workspace",
    element: <Workspace />,
  },
];

export default UserRoutes;
