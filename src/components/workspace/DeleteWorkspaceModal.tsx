import { useEffect, useState } from "react";

import Modal from "@/components/common/modal/Modal";

import Button from "../common/button/Button";
import Input from "../common/input/Input";

import WarnIcon from "@/assets/icon/common/warn-circle.svg?react";

type TDeleteWorkspaceModalProps = {
  isOpen: boolean;
  onClose: () => void;
  workspaceName: string;
  onConfirm: () => void;
  isLoading?: boolean;
};

export default function DeleteWorkspaceModal({
  isOpen,
  onClose,
  workspaceName,
  onConfirm,
  isLoading = false,
}: TDeleteWorkspaceModalProps) {
  const [confirmInput, setConfirmInput] = useState("");
  useEffect(() => {
    if (!isOpen) {
      setConfirmInput("");
    }
  }, [isOpen]);

  const canDelete =
    workspaceName.length > 0 && confirmInput.trim() === workspaceName;

  const handleConfirm = () => {
    if (!canDelete || isLoading) return;
    onConfirm();
  };
  const handleClose = () => {
    if (!isLoading) onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="워크스페이스를 삭제할게요"
      size="lg"
      padding="lg"
      disableOverlayClick={isLoading}
    >
      <div className="px-2 py-4 tablet:px-0">
        <div className="mb-5 flex justify-center">
          <WarnIcon className="h-12 w-12 text-info-red" aria-hidden="true" />
        </div>
        <h3 className="mb-2 text-center font-heading2 text-text-title break-keep">
          워크스페이스를 삭제할까요?
        </h3>
        <p className="mb-2 text-center font-body1 text-text-auth-sub break-keep">
          삭제하면 연결된 모든 데이터가 사라지고, 다시 되돌릴 수 없어요
        </p>
        <p className="mb-6 text-center font-body2 text-text-muted break-keep">
          아래 워크스페이스 이름을 그대로 입력해 주세요
        </p>
        <div className="mb-8 space-y-3">
          <div className="rounded-xl border border-surface-400/50 bg-surface-100 px-3 py-2.5">
            <p className="font-caption text-text-muted">확인용 이름</p>
            <p className="mt-0.5 break-all font-label text-text-title">
              {workspaceName}
            </p>
          </div>
          <Input
            label=""
            value={confirmInput}
            onChange={(e) => setConfirmInput(e.target.value)}
            placeholder="워크스페이스 이름"
            autoComplete="off"
            disabled={isLoading}
            aria-label="우커스페이스 이름 확인 입력"
            containerClassName="mt-0"
            inputClassName="font-body2"
          />
        </div>

        <div className="flex justify-center gap-3 tablet:flex-col">
          <Button
            type="button"
            variant="outline"
            size="big"
            onClick={handleClose}
            disabled={isLoading}
            className="auto tablet:w-full"
          >
            취소
          </Button>
          <Button
            type="button"
            variant="danger"
            size="big"
            onClick={handleConfirm}
            disabled={isLoading || !canDelete}
            className="auto tablet:w-full"
          >
            {isLoading ? "삭제 중..." : "영구 삭제"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
