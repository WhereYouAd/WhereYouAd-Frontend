import Modal from "../common/modal/Modal";
import ModalContent from "../common/modal/ModalContent";

import MessageCircleWarningIcon from "@/assets/icon/workspace/message-circle-warning.svg?react";

type TTransferOwnershipBlockedModal = {
  isOpen: boolean;
  onClose: () => void;
};
export default function TransferOwnershipBlockedModal({
  isOpen,
  onClose,
}: TTransferOwnershipBlockedModal) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      padding="lg"
      title="관리자 변경 불가"
    >
      <ModalContent
        icon={<MessageCircleWarningIcon className="text-status-red" />}
        title="관리자를 변경할 수 없습니다"
        description={
          <>
            현재 소유권을 이전할 수 있는 멤버가 없습니다. <br />
            변경을 원하시면 먼저 다른 멤버에게 관리자 권한을 부여해주세요.
          </>
        }
        buttonText="확인"
        onConfirm={onClose}
        variant="danger"
      />
    </Modal>
  );
}
