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
    element: <LandingPage />,
    errorElement: <Error />,
  },
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
