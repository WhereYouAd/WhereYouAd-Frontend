import { create } from "zustand";

import type { MODAL_TYPES } from "@/components/modal/ModalProvider";

export type TModalType = (typeof MODAL_TYPES)[keyof typeof MODAL_TYPES];

export type TModalProps = {
  [MODAL_TYPES.PRIVACY]: {
    onAgree?: (agreements: {
      privacy: boolean;
      marketing: boolean;
      thirdParty: boolean;
    }) => void;
  };
};

export type TModalState = {
  [K in TModalType]: {
    modalType: K;
    modalProps: K extends keyof TModalProps ? TModalProps[K] : never;
  };
}[TModalType];

interface IModalStoreState {
  modalType: TModalType | null;
  modalProps: any;
  isOpen: boolean;
  openModal: <T extends TModalType>(payload: {
    modalType: T;
    modalProps: T extends keyof TModalProps ? TModalProps[T] : never;
  }) => void;
  closeModal: () => void;
}

const useModalStore = create<IModalStoreState>((set) => ({
  modalType: null,
  isOpen: false,
  modalProps: {},
  openModal: (payload) =>
    set(() => ({
      modalType: payload.modalType,
      modalProps: payload.modalProps,
      isOpen: true,
    })),
  closeModal: () =>
    set(() => ({
      modalType: null,
      modalProps: {},
      isOpen: false,
    })),
}));

export default useModalStore;
