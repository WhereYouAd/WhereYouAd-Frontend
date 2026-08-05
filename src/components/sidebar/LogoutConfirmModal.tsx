import Button from "@/components/common/button/Button";
import Modal from "@/components/common/modal/Modal";

import LogoutIcon from "@/assets/icon/common/logout.svg?react";

interface ILogoutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export default function LogoutConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}: ILogoutConfirmModalProps) {
  const handleConfirm = () => {
    if (isLoading) return;
    onConfirm();
  };

  const handleClose = () => {
    if (isLoading) return;
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="md"
      padding="md"
      title="로그아웃 확인"
      hideCloseButton={isLoading}
      disableOverlayClick={isLoading}
    >
      <div className="px-2 pt-4 pb-0 text-center tablet:px-0">
        <div className="mb-5 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-info-red/8 ring-1 ring-info-red/15">
            <LogoutIcon className="h-8 w-8 text-info-red" aria-hidden />
          </div>
        </div>

        <h3 className="mb-3 font-heading2 text-text-title">
          로그아웃 하시겠습니까?
        </h3>
        <p className="mb-6 font-body1 leading-relaxed text-text-auth-sub">
          로그아웃 후 첫 페이지로 이동합니다.
        </p>

        <div className="flex items-center">
          <Button
            type="button"
            variant="danger"
            size="big"
            className="flex-1"
            onClick={handleConfirm}
            disabled={isLoading}
            aria-label="로그아웃 확인"
          >
            {isLoading ? "로그아웃 중..." : "로그아웃"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
