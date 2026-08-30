import { PLATFORM_MAP } from "@/types/dashboard/provider";
import type { TIntegrationProvider } from "@/types/integration/platformConnection";

import Button from "@/components/common/button/Button";
import Modal from "@/components/common/modal/Modal";

import WarnIcon from "@/assets/icon/common/warn-circle.svg?react";

interface IPlatformDisconnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  provider: TIntegrationProvider;
  onConfirm: () => void;
  isLoading?: boolean;
}

export default function PlatformDisconnectModal({
  isOpen,
  onClose,
  provider,
  onConfirm,
  isLoading = false,
}: IPlatformDisconnectModalProps) {
  const platformLabel = PLATFORM_MAP[provider] ?? provider;

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
      title="연동 해제 확인"
      hideCloseButton={isLoading}
      disableOverlayClick={isLoading}
    >
      <div className="px-2 py-6 text-center">
        <div className="mb-6 flex justify-center">
          <WarnIcon className="h-15 w-15 text-info-red" aria-hidden="true" />
        </div>

        <h3 className="mb-3 font-heading2 text-text-title">
          {platformLabel} 광고 계정 연동을 해제하시겠습니까?
        </h3>

        <p className="mb-7 font-body1 text-text-auth-sub">
          해제 후에도 기존 계정을 다시 연동할 수 있으며, 계정은 매일 새벽 4시에
          삭제됩니다.
          <br />
          다른 계정으로 바꾸려면 계정 삭제가 완료된 후 새로 연동해 주세요.
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
            aria-label="연동 해제 확인"
          >
            {isLoading ? "해제 중..." : "연동 해제"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
