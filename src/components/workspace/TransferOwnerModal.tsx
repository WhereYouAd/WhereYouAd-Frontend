import { useEffect, useState } from "react";

import type { TWorkspaceMember } from "@/types/workspace/workspace";

import Button from "@/components/common/button/Button";
import MemberSearchSelect from "@/components/workspace/MemberSearchSelect";

import Modal from "../common/modal/Modal";

import WarnIcon from "@/assets/icon/common/warn-circle.svg?react";

type TTransferOwnerModalProps = {
  isOpen: boolean;
  onClose: () => void;
  currentOwnerName: string;
  candidates: TWorkspaceMember[];
  onConfirm: (newOwnerUserId: number) => void;
  isLoading?: boolean;
};

export default function TransferOwnerModal({
  isOpen,
  onClose,
  currentOwnerName,
  candidates,
  onConfirm,
  isLoading = false,
}: TTransferOwnerModalProps) {
  const [selectedMember, setSelectedMember] = useState<TWorkspaceMember | null>(
    null,
  );
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      setSelectedMember(null);
      setIsSelectOpen(false);
    }
  }, [isOpen]);
  const handleConfirm = () => {
    if (!selectedMember || isLoading) return;
    onConfirm(selectedMember.memberId);
  };
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        if (!isLoading) onClose();
      }}
      size="lg"
      padding="lg"
      title="조직 소유권 양도"
      disableOverlayClick={isLoading}
    >
      <div className="px-2 py-4">
        <div className="mb-5 flex justify-center">
          <WarnIcon className="h-12 w-12 text-info-yellow" aria-hidden="true" />
        </div>

        <h3 className="mb-2 text-center font-heading2 text-text-title">
          조직 소유권을 양도할까요?
        </h3>
        <p className="mb-1 text-center font-body1 text-text-auth-sub">
          현재 소유자: {currentOwnerName}
        </p>
        <p className="mb-6 text-center font-body2 text-text-muted">
          양도 대상은 같은 대상의 관리자(ADMIN)만 선택할 수 있습니다
          <br />
          양도 후에는 되돌릴 수 없으며, 새 소유자만 다시 양도 가능합니다.
        </p>
        <div className="mb-8">
          <p className="mb-2 font-body2 text-text-title">새 소유자 선택</p>
          <MemberSearchSelect
            candidates={candidates}
            selectedMember={selectedMember}
            onSelect={setSelectedMember}
            isOpen={isSelectOpen}
            onOpenChange={setIsSelectOpen}
            placeholder="소유권을 양도할 관리자를 검색하세요"
          />
          {candidates.length === 0 && (
            <p className="mt-2 font-body2 text-info-red">
              양도 가능한 관리자가 없습니다. 먼저 다른 멤버를 관리자로
              지정해주세요
            </p>
          )}
        </div>
        <div className="flex justify-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="big"
            onClick={onClose}
            disabled={isLoading}
            className="w-auto tablet:w-full"
          >
            취소
          </Button>
          <Button
            type="button"
            variant="primary"
            size="big"
            onClick={handleConfirm}
            disabled={isLoading || !selectedMember || candidates.length === 0}
            className="w-auto tablet:w-full"
          >
            {isLoading ? "변경 중..." : "변경하기"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
