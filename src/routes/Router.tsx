import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";

import AuthRoutes from "./AuthRoutes";
import MainRoutes from "./MainRoutes";

import AuthLayout from "@/layout/auth/AuthLayout";
import GlobalLayout from "@/layout/GlobalLayout";
import MainLayout from "@/layout/main/MainLayout";
import Error from "@/pages/common/Error";
import useAuthStore from "@/store/useAuthStore";

const LandingPage = React.lazy(() => import("@/pages/landing/LandingPage"));

function AuthGuard({ children }: { children: React.ReactNode }) {
  // TEMP: 대시보드 접근 테스트용 (로그인 가드 비활성화)
  // 필요 시 false로 되돌리거나, 아래 로직을 원복하세요.
  const TEMP_DISABLE_AUTH_GUARD = true;
  if (TEMP_DISABLE_AUTH_GUARD) return <>{children}</>;

  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const isTokenInitialized = useAuthStore((state) => state.isTokenInitialized);

  if (!isTokenInitialized) {
    return null;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export const router = createBrowserRouter([
  {
    element: <GlobalLayout />,
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: <Navigate to="/landing" replace />,
      },
      {
        path: "/landing",
        element: (
          <React.Suspense fallback={null}>
            <LandingPage />
          </React.Suspense>
        ),
      },
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
