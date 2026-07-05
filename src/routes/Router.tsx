import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";

import AuthRoutes from "./AuthRoutes";
import MainRoutes from "./MainRoutes";

import AuthLayout from "@/layout/auth/AuthLayout";
import GlobalLayout from "@/layout/GlobalLayout";
import MainLayout from "@/layout/main/MainLayout";
import ErrorPage from "@/pages/common/Error";
import NotFound from "@/pages/common/NotFound";
import useAuthStore from "@/store/useAuthStore";

const LandingPage = React.lazy(() => import("@/pages/landing/LandingPage"));

function AuthGuard({ children }: { children: React.ReactNode }) {
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
    path: "/",
    element: (
      <React.Suspense fallback={null}>
        <LandingPage />
      </React.Suspense>
    ),
    errorElement: <ErrorPage />,
  },
  {
    element: <GlobalLayout />,
    errorElement: <ErrorPage />,
    children: [
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
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);
