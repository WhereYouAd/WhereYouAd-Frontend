import { Outlet } from "react-router-dom";

import ModalProvider from "@/components/modal/ModalProvider";

export default function RootLayout() {
  return (
    <>
      <Outlet />
      <ModalProvider />
    </>
  );
}
