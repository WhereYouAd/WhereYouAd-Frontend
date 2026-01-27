import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import PrivacyModal from "./privacyModal/PrivacyModal";

import useModalStore from "@/store/useModalStore";

export const MODAL_TYPES = {
  PRIVACY: "PRIVACY",
} as const;

// 모달 등록
export const MODAL_COMPONENTS = {
  [MODAL_TYPES.PRIVACY]: PrivacyModal,
};

export default function ModalProvider() {
  const { modalType, closeModal, modalProps } = useModalStore();
  const location = useLocation();
  useEffect(() => {
    closeModal();
  }, [location]);

  if (!modalType) {
    return null;
  }

  const ModalComponent = MODAL_COMPONENTS[modalType];

  return <ModalComponent onClose={closeModal} {...modalProps} />;
}
