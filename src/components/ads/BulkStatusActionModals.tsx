import type {
  IBulkOperableCopy,
  TBulkScope,
} from "@/hooks/ads/useBulkOperableControl";

import Modal from "@/components/common/modal/Modal";
import ModalContent, {
  type TModalDetailItem,
} from "@/components/common/modal/ModalContent";

import WarnCircleIcon from "@/assets/icon/common/warn-circle.svg?react";

interface IBulkControlModalHandle {
  isOpen: boolean;
  isLoading: boolean;
  closeModal: () => void;
  handleConfirm: (action: () => Promise<void>) => Promise<void>;
}

interface IBulkStatusActionModalsProps {
  copy: IBulkOperableCopy;
  pauseScope: TBulkScope;
  resumeScope: TBulkScope;
  selectedOngoingCount: number;
  selectedPausedCount: number;
  ongoingAllCount: number;
  pausedAllCount: number;
  pauseDetailItems: readonly TModalDetailItem[];
  resumeDetailItems: readonly TModalDetailItem[];
  pauseModal: IBulkControlModalHandle;
  resumeModal: IBulkControlModalHandle;
  onConfirmPause: () => Promise<void>;
  onConfirmResume: () => Promise<void>;
}

export default function BulkStatusActionModals({
  copy,
  pauseScope,
  resumeScope,
  selectedOngoingCount,
  selectedPausedCount,
  ongoingAllCount,
  pausedAllCount,
  pauseDetailItems,
  resumeDetailItems,
  pauseModal,
  resumeModal,
  onConfirmPause,
  onConfirmResume,
}: IBulkStatusActionModalsProps) {
  const { entityName, entityObject, exposureNoun } = copy;

  return (
    <>
      <Modal
        isOpen={pauseModal.isOpen}
        onClose={pauseModal.closeModal}
        title={copy.pauseModalTitle}
      >
        <ModalContent
          icon={<WarnCircleIcon className="h-7 w-7 text-info-red" />}
          title={
            pauseScope === "all"
              ? `운영 중인 ${entityObject} 모두 중단할까요?`
              : `선택한 ${entityObject} 중단할까요?`
          }
          description={
            pauseScope === "all"
              ? `운영 중인 ${ongoingAllCount}개 ${entityName}의 ${exposureNoun}이 즉시 중단됩니다.`
              : `선택한 ${selectedOngoingCount}개 ${entityName}의 ${exposureNoun}이 즉시 중단됩니다.`
          }
          detailItems={pauseDetailItems}
          detailListTitle={copy.pauseDetailListTitle}
          buttonText="중단하기"
          onConfirm={() => pauseModal.handleConfirm(onConfirmPause)}
          isLoading={pauseModal.isLoading}
          variant="danger"
        />
      </Modal>

      <Modal
        isOpen={resumeModal.isOpen}
        onClose={resumeModal.closeModal}
        title={copy.resumeModalTitle}
      >
        <ModalContent
          icon={<WarnCircleIcon className="h-7 w-7 text-info-blue" />}
          title={
            resumeScope === "all"
              ? `중단된 ${entityObject} 모두 재개할까요?`
              : `선택한 ${entityObject} 재개할까요?`
          }
          description={
            resumeScope === "all"
              ? `중단된 ${pausedAllCount}개 ${entityName}의 ${exposureNoun}이 즉시 재개됩니다.`
              : `선택한 ${selectedPausedCount}개 ${entityName}의 ${exposureNoun}이 즉시 재개됩니다.`
          }
          detailItems={resumeDetailItems}
          detailListTitle={copy.resumeDetailListTitle}
          buttonText="재개하기"
          onConfirm={() => resumeModal.handleConfirm(onConfirmResume)}
          isLoading={resumeModal.isLoading}
          variant="primary"
        />
      </Modal>
    </>
  );
}
