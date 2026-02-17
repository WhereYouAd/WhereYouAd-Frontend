import { lazy, Suspense } from "react";
import { type RouteObject, useLocation } from "react-router-dom";

import { loadable } from "@/utils/loadable";

import AuthFormSkeleton from "@/components/auth/skeleton/AuthFormSkeleton";
import LoginPageSkeleton from "@/components/auth/skeleton/LoginPageSkeleton";
import SignupEmailStepSkeleton from "@/components/auth/skeleton/SignupEmailStepSkeleton";
import SignupPageSkeleton from "@/components/auth/skeleton/SignupPageSkeleton";

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
  <LoginPageSkeleton />,
);

const RedirectPage = loadable(
  lazy(() => import("@/pages/auth/RedirectPage")),
  <AuthFormSkeleton />,
);

const Signup = lazy(() => import("@/pages/auth/Signup"));

function SignupPage() {
  const location = useLocation();
  const step = location.state?.step;

  return (
    <Suspense
      fallback={
        step === 1 ? <SignupEmailStepSkeleton /> : <SignupPageSkeleton />
      }
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
