import { create } from "zustand";

export const MODAL_TYPES = {
  PRIVACY: "PRIVACY",
} as const;

export type TModalType = (typeof MODAL_TYPES)[keyof typeof MODAL_TYPES];

export type TGlobalModalProps = {
  [MODAL_TYPES.PRIVACY]: {
    onAgree?: (agreements: { privacy: boolean; marketing: boolean }) => void;
    initialState?: {
      privacy: boolean;
      marketing: boolean;
    };
  };
};

type TModalState =
  | {
      modalType: null;
      modalProps: Record<string, never>;
    }
  | {
      [K in TModalType]: {
        modalType: K;
        modalProps: TGlobalModalProps[K];
      };
    }[TModalType];

interface IModalStoreActions {
  openModal: <T extends TModalType>(
    modalType: T,
    modalProps: TGlobalModalProps[T],
  ) => void;
  closeModal: () => void;
}

type TModalStoreState = TModalState & IModalStoreActions;

const useModalStore = create<TModalStoreState>((set) => ({
  modalType: null,
  modalProps: {},
  openModal: (modalType, modalProps) =>
    set({
      modalType,
      modalProps,
    } as TModalState),
  closeModal: () =>
    set({
      modalType: null,
      modalProps: {},
    }),
}));

export default useModalStore;
