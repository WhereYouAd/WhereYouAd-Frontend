import { Outlet } from "react-router-dom";

import { useCoreQuery } from "@/hooks/customQuery";

import Sidebar from "@/components/Sidebar/Sidebar";

import { getMyInfo } from "@/api/auth/auth";

export default function MainLayout() {
  useCoreQuery(["myInfo"], getMyInfo);
  return (
    <div className="flex h-screen p-3 bg-gray-50 sm:p-5">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="mx-auto w-full max-w-400 py-6 px-4 sm:px-6 lg:px-20">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
