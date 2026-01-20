import type { PropsWithChildren } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";

import AuthLayout from "@/layout/auth/AuthLayout";
import Layout from "@/layout/common/Layout";
import Error from "@/pages/common/Error";

import FindPw from "@/pages/auth/FindPw";
import Login from "@/pages/auth/Login";
import Signup from "@/pages/auth/Signup";
import OverviewDashboard from "@/pages/dashboard/overview/OverviewDashboard";
import PlatformDashboard from "@/pages/dashboard/platform/PlatformDashboard";
import ReplayDashboard from "@/pages/dashboard/replay/ReplayDashboard";
import Setting from "@/pages/setting/Setting";
import Workspace from "@/pages/workspace/Workspace";

const checkAuth = (): boolean => {
  // 실제 인증 로직으로 교체 필요합니다.
  return true;
};

function ProtectedRoute({ children }: PropsWithChildren) {
  const isLoggedIn = checkAuth();

  if (!isLoggedIn) {
    return <Navigate to="/auth/login" replace />;
  }

  return <>{children}</>;
}

function PublicRoute({ children }: PropsWithChildren) {
  const isLoggedIn = checkAuth();

  if (isLoggedIn) {
    return <Navigate to="/dashboard/overview" replace />;
  }

  return <>{children}</>;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/auth/signup" replace />,
  },
  {
    path: "/auth",
    element: (
      <PublicRoute>
        <AuthLayout />
      </PublicRoute>
    ),
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Navigate to="/auth/signup" replace />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "find-pw",
        element: <FindPw />,
      },

    ],
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard/overview" replace />,
      },
      {
        path: "overview",
        element: <OverviewDashboard />,
      },
      {
        path: "replay",
        element: <ReplayDashboard />,
      },
      {
        path: "platform",
        element: <PlatformDashboard />,
      },
    ],
  },
  {
    path: "/user",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    errorElement: <Error />,
    children: [
      {
        path: "setting",
        element: <Setting />,
      },
      {
        path: "workspace",
        element: <Workspace />,
      },
    ],
  },
]);

export default router;
