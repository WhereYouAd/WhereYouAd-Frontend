import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";

import AuthRoutes from "./AuthRoutes";
import MainRoutes from "./MainRoutes";

import AuthLayout from "@/layout/auth/AuthLayout";
import GlobalLayout from "@/layout/GlobalLayout";
import MainLayout from "@/layout/main/MainLayout";
import Error from "@/pages/common/Error";
import useAuthStore from "@/store/useAuthStore";

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
