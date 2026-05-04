import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";

import ModalProvider from "@/components/modal/ModalProvider";

export default function GlobalLayout() {
  return (
    <>
      <Outlet />
      <ModalProvider />
      <Toaster richColors position="top-center" />
    </>
  );
}
