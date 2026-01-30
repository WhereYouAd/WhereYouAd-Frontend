import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";

import AuthRoutes from "./AuthRoutes";
import MainRoutes from "./MainRoutes";

import AuthLayout from "@/layout/auth/AuthLayout";
import GlobalLayout from "@/layout/GlobalLayout";
import MainLayout from "@/layout/main/MainLayout";
import Error from "@/pages/common/Error";

function AuthGuard({ children }: { children: React.ReactNode }) {
  // 실제 인증 상태 확인 로직으로 대체 예정
  const isAuthenticated = false;

  if (!isAuthenticated) {
    return <Navigate to="/signup" replace />;
  }

  return <>{children}</>;
}

export const router = createBrowserRouter([
  {
    element: <GlobalLayout />,
    errorElement: <Error />,
    children: [
      {
        element: <AuthLayout />,
        children: AuthRoutes,
      },
      {
        element: (
          <AuthGuard>
            <MainLayout />
          </AuthGuard>
        ),
        children: MainRoutes,
      },
    ],
  },
]);
