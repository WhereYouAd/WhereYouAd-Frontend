import { lazy, Suspense } from "react";
import { type RouteObject, useLocation } from "react-router-dom";

import { loadable } from "@/utils/loadable";

import AuthFormSkeleton from "@/components/auth/skeleton/AuthFormSkeleton";
import LoginSkeleton from "@/components/auth/skeleton/LoginSkeleton";
import SignupSkeleton from "@/components/auth/skeleton/SignupSkeleton";
import SignupStep01Skeleton from "@/components/auth/skeleton/SignupStep01Skeleton";

const FindEmail = loadable(
  lazy(() => import("@/pages/auth/FindEmail")),
  <AuthFormSkeleton />,
);
const FindPw = loadable(
  lazy(() => import("@/pages/auth/FindPw")),
  <AuthFormSkeleton />,
);
const Login = loadable(
  lazy(() => import("@/pages/auth/Login")),
  <LoginSkeleton />,
);

const RedirectPage = loadable(
  lazy(() => import("@/pages/auth/RedirectPage")),
  <AuthFormSkeleton />,
);

// Signup은 Fallback이 달라짐 -> raw lazy 컴포넌트 사용
const Signup = lazy(() => import("@/pages/auth/Signup"));

function SignupPage() {
  const location = useLocation();
  const step = location.state?.step;

  return (
    <Suspense
      fallback={step === 1 ? <SignupStep01Skeleton /> : <SignupSkeleton />}
    >
      <Signup />
    </Suspense>
  );
}

const AuthRoutes: RouteObject[] = [
  {
    path: "signup",
    element: <SignupPage />,
  },
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "find-email",
    element: <FindEmail />,
  },
  {
    path: "find-pw",
    element: <FindPw />,
  },
  {
    path: "oauth2/redirect",
    element: <RedirectPage />,
  },
];

export default AuthRoutes;
