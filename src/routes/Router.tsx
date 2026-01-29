import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";

import AuthRoutes from "./AuthRoutes";
import MainRoutes from "./MainRoutes";
import UserRoutes from "./UserRoutes";

import AuthLayout from "@/layout/auth/AuthLayout";
import DefaultLayout from "@/layout/default/DefaultLayout";
import MainLayout from "@/layout/main/MainLayout";

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
    element: <DefaultLayout />,
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
        children: [...MainRoutes, ...UserRoutes],
      },
    ],
  },
]);
