import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import CloseIcon from "@/assets/icon/x-icon.svg?react";

type TModalprops = {
  isOpen?: boolean;
  children: ReactNode;
  onClose: () => void;
};

export default function Modal({
  isOpen = true,
  children,
  onClose,
}: TModalprops) {
  const [isVisible, setIsVisible] = useState(isOpen);

  useEffect(() => {
    setIsVisible(isOpen);
  }, [isOpen]);

  return createPortal(
    isVisible && (
      <div className="z-1000 fixed top-0 left-0 w-screen h-screen bg-black/30 flex items-center justify-center">
        <div className="relative bg-white p-5 flex flex-col rounding-15 shadow-Medium min-w-[320px]">
          <div
            className="absolute top-4 right-4 cursor-pointer"
            onClick={onClose}
          >
            <CloseIcon className="w-5 h-auto" />
          </div>
          <div className="flex w-full">{children}</div>
        </div>
      </div>
    ),
    document.getElementById("modal-root")!,
  );
}
