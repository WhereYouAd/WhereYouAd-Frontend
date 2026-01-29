import { Outlet } from "react-router-dom";

import ModalProvider from "@/components/modal/ModalProvider";

export default function DefaultLayout() {
  return (
    <>
      <Outlet />
      <ModalProvider />
    </>
  );
}
