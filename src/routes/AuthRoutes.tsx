import { lazy } from "react";
import type { RouteObject } from "react-router-dom";

const FindEmail = lazy(() => import("@/pages/auth/FindEmail"));
const FindPw = lazy(() => import("@/pages/auth/FindPw"));
const Login = lazy(() => import("@/pages/auth/Login"));
const Signup = lazy(() => import("@/pages/auth/Signup"));

const AuthRoutes: RouteObject[] = [
  {
    path: "signup",
    element: <Signup />,
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
];

export default AuthRoutes;
