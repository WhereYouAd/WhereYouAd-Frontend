import "./App.css";

import { RouterProvider } from "react-router-dom";

import { useTokenRefresh } from "@/hooks/auth/useTokenRefresh";

import { router } from "@/routes/Router";

function App() {
  useTokenRefresh();

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
