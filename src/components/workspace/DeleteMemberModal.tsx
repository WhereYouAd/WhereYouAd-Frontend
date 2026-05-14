import type { TWorkspaceMember } from "@/types/workspace/workspace";

import Button from "../common/button/Button";
import Modal from "../common/modal/Modal";

import WarnIcon from "@/assets/icon/common/warn-circle.svg?react";

type TDeleteMemberModalProps = {
  isOpen: boolean;
  onClose: () => void;
  member: TWorkspaceMember | null;
  onConfirm: (member: TWorkspaceMember) => void;
  isLoading?: boolean;
};

export default function DeleteMemberModal({
  isOpen,
  onClose,
  member,
  onConfirm,
  isLoading = false,
}: TDeleteMemberModalProps) {
  const handleConfirm = () => {
    if (!member || isLoading) return;
    onConfirm(member);
  };
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      padding="lg"
      title="팀원 삭제 확인"
    >
      <div className="text-center px-2 py-6">
        <div className="flex justify-center mb-6">
          <WarnIcon className="h-15 w-15 text-info-red" aria-hidden="true" />
        </div>
        <h3 className="mb-3 font-heading2 text-text-title">
          팀원을 삭제하시겠습니까?
        </h3>
        <p className="font-body1 text-text-auth-sub mb-7">
          {member
            ? `${member.name}님을 팀에서 삭제합니다`
            : "선택한 팀원을 삭제합니다"}
          <br />이 작업은 되돌릴 수 없습니다.
        </p>
        <div className="flex justify-center">
          <Button
            variant="danger"
            size="big"
            aria-label="멤버 삭제 버튼"
            onClick={handleConfirm}
            className="w-auto tablet:w-full"
            type="button"
            disabled={!member || isLoading}
          >
            {isLoading ? "삭제 중.." : "삭제하기"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
