import { Suspense } from "react";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <Outlet />
      </Suspense>
    </div>
  );
}
