import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-surface-100">
      <div className="flex flex-1 w-full items-center justify-center overflow-y-auto px-6 py-12">
        <Outlet />
      </div>
    </div>
  );
}
