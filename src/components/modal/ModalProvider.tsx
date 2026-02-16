import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import PrivacyModal from "./privacyModal/PrivacyModal";

import useModalStore, {
  MODAL_TYPES,
  type TGlobalModalProps,
} from "@/store/useModalStore";

function ModalProvider() {
  const { modalType, closeModal, modalProps } = useModalStore();
  const location = useLocation();

  useEffect(() => {
    closeModal();
  }, [location.pathname, closeModal]);

  if (!modalType) {
    return null;
  }

  switch (modalType) {
    case MODAL_TYPES.PRIVACY: {
      const props = modalProps as TGlobalModalProps[typeof MODAL_TYPES.PRIVACY];
      return <PrivacyModal onClose={closeModal} {...props} />;
    }

    default: {
      if (import.meta.env.DEV) {
        console.warn(`Modal component not found for type: ${modalType}`);
      }
      return null;
    }
  }
}

export default ModalProvider;
