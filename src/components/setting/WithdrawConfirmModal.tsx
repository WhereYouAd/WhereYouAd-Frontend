import Button from "../common/button/Button";
import Modal from "../common/modal/Modal";

import WarnIcon from "@/assets/icon/common/warn-circle.svg?react";

interface IWithdrawConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export default function WithdrawConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}: IWithdrawConfirmModalProps) {
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
      size="lg"
      padding="lg"
      title="회원 탈퇴 확인"
      hideCloseButton={isLoading}
      disableOverlayClick={isLoading}
    >
      <div className="px-2 text-center">
        <div className="mb-6 flex justify-center">
          <WarnIcon className="h-15 w-15 text-info-red" aria-hidden="true" />
        </div>

        <h3 className="mb-3 font-heading2 text-text-title">
          정말로 회원탈퇴하시겠습니까?
        </h3>

        <p className="mb-7 font-body1 text-text-auth-sub">
          탈퇴 요청 시 계정은 바로 비활성화되며, <br /> 30일 후 서버에서 완전히
          삭제됩니다. <br />이 작업은 되돌리기 어려우니 신중히 결정해 주세요
        </p>
        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            size="big"
            className="flex-1"
            onClick={handleClose}
            disabled={isLoading}
          >
            취소
          </Button>
          <Button
            type="button"
            variant="danger"
            size="big"
            className="flex-1"
            onClick={handleConfirm}
            disabled={isLoading}
            aria-label="회원 탈퇴 확인"
          >
            {isLoading ? "탈퇴 진행 중..." : "회원 탈퇴"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
