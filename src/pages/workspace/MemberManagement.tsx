import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import type { TTransferCandidate } from "@/types/workspace/workspace";

import ControlBox from "@/components/common/controlbox/ControlBox";
import MemberList from "@/components/workspace/MemberList";
import PermissionTable from "@/components/workspace/PermissionTable";
import TransferOwnershipBlockedModal from "@/components/workspace/TransferOwnershipBlockedModal";
import TransferOwnershipModal from "@/components/workspace/TransferOwnershipModal";

import WarnIcon from "@/assets/icon/common/warn-circle.svg?react";

const mockTransferCandidates: TTransferCandidate[] = [
  {
    memberId: 1,
    name: "이유찬",
    email: "uuuchan@wya.com",
    profileImageUrl: null,
    role: "ADMIN",
    isMe: true,
  },
  {
    memberId: 2,
    name: "박치국",
    email: "peach@wya.com",
    profileImageUrl: null,
    role: "MEMBER",
    isMe: false,
  },
  {
    memberId: 3,
    name: "강승호",
    email: "kang@wya.com",
    profileImageUrl: null,
    role: "MEMBER",
    isMe: false,
  },
  {
    memberId: 4,
    name: "플렉센",
    email: "flex@wya.com",
    profileImageUrl: null,
    role: "ADMIN",
    isMe: false,
  },
  {
    memberId: 5,
    name: "잭로그",
    email: "jackjack@wya.com",
    profileImageUrl: null,
    role: "MEMBER",
    isMe: false,
  },
  {
    memberId: 6,
    name: "양의지",
    email: "yang@wya.com",
    profileImageUrl: null,
    role: "ADMIN",
    isMe: false,
  },
  {
    memberId: 7,
    name: "최민석",
    email: "kkokko@wya.com",
    profileImageUrl: null,
    role: "ADMIN",
    isMe: false,
  },
  {
    memberId: 8,
    name: "양재훈",
    email: "yanghun@wya.com",
    profileImageUrl: null,
    role: "MEMBER",
    isMe: false,
  },
];

export default function MemberManagement() {
  const navigate = useNavigate();
  const [changing, setChanging] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isBlockedModalOpen, setIsBlockedModalOpen] = useState(false);

  const transferableCandidates = mockTransferCandidates.filter(
    (member) => !member.isMe,
  );
  const openChangeModal = () => {
    if (transferableCandidates.length === 0) {
      setIsBlockedModalOpen(true);
      return;
    }
    setIsTransferModalOpen(true);
  };
  const closeTransferModal = () => {
    if (changing) return;
    setIsTransferModalOpen(false);
  };
  const handleTransferOwnership = (member: TTransferCandidate) => {
    setChanging(true);
    setTimeout(() => {
      toast.success(`${member.name}님으로 관리자가 변경되었습니다`);
      setChanging(false);
      setIsTransferModalOpen(false);
      navigate("/workspace");
    }, 500);
  };
  return (
    <section className="w-full min-w-0">
      <header className="mb-7">
        <h1 className="font-heading2">멤버 관리</h1>
        <p className="font-body1 text-text-sub">
          팀 구성원을 효율적으로 관리하세요
        </p>
      </header>
      <div className="flex flex-col gap-10 w-full min-w-0">
        <MemberList orgId={1} />
        <PermissionTable />
        <ControlBox
          title="관리자 변경"
          description={`이 조직의 소유권을 다른 멤버에게 양도합니다. 이 작업은 되돌릴 수 없습니다.`}
          buttonText="소유권 이전"
          onButtonClick={openChangeModal}
          className="w-full min-w-0"
          containerClassName="bg-status-red/10 border-status-red"
          titleClassName="text-status-red"
          descriptionClassName="text-text-auth-sub"
          buttonVariant="dangerSoft"
          buttonSize="big"
          buttonClassName="px-8 !rounded-component-md"
          // buttonDisabled={}
          leadingSlot={<WarnIcon className="text-status-red w-15 h-15" />}
        />
        <TransferOwnershipModal
          isOpen={isTransferModalOpen}
          onClose={closeTransferModal}
          candidates={transferableCandidates}
          onConfirm={handleTransferOwnership}
          isLoading={changing}
        />
        <TransferOwnershipBlockedModal
          isOpen={isBlockedModalOpen}
          onClose={() => setIsBlockedModalOpen(false)}
        />
      </div>
    </section>
  );
}
