import { Outlet } from "react-router-dom";

import Sidebar from "@/components/Sidebar/Sidebar";

export default function MainLayout() {
  return (
    <div className="flex h-screen p-5 bg-gray-50">
      <Sidebar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
