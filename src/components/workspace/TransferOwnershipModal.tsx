import { useEffect, useState } from "react";

import type { TTransferCandidate } from "@/types/workspace/workspace";

import MemberSearchSelect from "./MemberSearchSelect";
import Button from "../common/button/Button";
import Modal from "../common/modal/Modal";

import MessageCircleWarningIcon from "@/assets/icon/common/warn-circle.svg?react";

type TTransferOwnershipModalProps = {
  isOpen: boolean;
  onClose: () => void;
  candidates: TTransferCandidate[];
  onConfirm: (member: TTransferCandidate) => void;
  isLoading?: boolean;
};

export default function TransferOwnershipModal({
  isOpen,
  onClose,
  candidates,
  onConfirm,
  isLoading = false,
}: TTransferOwnershipModalProps) {
  const [selectedMember, setSelectedMember] =
    useState<TTransferCandidate | null>(null);
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setSelectedMember(null);
      setIsSelectOpen(false);
    }
  }, [isOpen]);
  const handleConfirm = () => {
    if (!selectedMember) return;
    onConfirm(selectedMember);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      padding="lg"
      title="관리자 변경 확인"
      className={`${isSelectOpen ? "h-[620px]" : ""} overflow-hidden transition-all duration-200`}
    >
      <div className="text-center px-2 py-6 ">
        <div className="flex justify-center mb-6">
          <MessageCircleWarningIcon
            className="text-status-red"
            aria-hidden="true"
          />
        </div>
        <h2 className="font-heading2 text-text-main mb-3">
          관리자를 변경하시겠습니까?
        </h2>
        <p className="font-body1 text-text-auth-sub mb-7">
          이 조직의 소유권을 다른 멤버에게 양도합니다. <br /> 이 작업은 절대
          되돌릴 수 없습니다.
        </p>
        <div className="mb-8">
          <MemberSearchSelect
            candidates={candidates}
            selectedMember={selectedMember}
            onSelect={setSelectedMember}
            isOpen={isSelectOpen}
            onOpenChange={setIsSelectOpen}
          />
        </div>
        <div className="flex justify-center">
          <Button
            variant="danger"
            size="big"
            aria-label="변경하기"
            onClick={handleConfirm}
            className="w-full md:w-auto"
            type="button"
            disabled={!selectedMember || isLoading}
          >
            {isLoading ? "변경 중.." : "변경하기"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
