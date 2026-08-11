import Modal from "../common/modal/Modal";
import ModalContent from "../common/modal/ModalContent";

import TrashIcon from "@/assets/icon/common/trash.svg?react";

interface ITimelineDeleteModalProps {
  target: { id: number; name: string } | null;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function TimelineDeleteModal({
  target,
  isDeleting,
  onClose,
  onConfirm,
}: ITimelineDeleteModalProps) {
  return (
    <Modal
      isOpen={target != null}
      onClose={onClose}
      title="타임라인 삭제"
      disableOverlayClick={isDeleting}
    >
      <ModalContent
        icon={<TrashIcon className="h-7 w-7 text-info-red" />}
        title="해당 타임라인을 삭제할까요?"
        description={
          target
            ? `"${target.name}" 타임라인을 삭제하면 복구할 수 없습니다`
            : ""
        }
        buttonText="삭제하기"
        onConfirm={onConfirm}
        isLoading={isDeleting}
        variant="danger"
      />
    </Modal>
  );
}
