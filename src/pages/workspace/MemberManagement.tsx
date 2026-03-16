import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import Button from "@/components/common/button/Button";
import ControlBox from "@/components/common/controlbox/ControlBox";
import Input from "@/components/common/input/Input";
import Modal from "@/components/common/modal/Modal";
import MemberList from "@/components/workspace/MemberList";
import PermissionTable from "@/components/workspace/PermissionTable";

import MessageCircleWarningIcon from "@/assets/icon/workspace/message-circle-warning.svg?react";
import WarningIcon from "@/assets/icon/workspace/warning.svg?react";

export default function MemberManagement() {
  const navigate = useNavigate();
  const [changeOpen, setChangeOpen] = useState(false);
  const [changing, setChanging] = useState(false);
  const openChangeModal = () => {
    setChangeOpen(true);
  };
  const onChange = () => {
    setChanging(true);
    toast.success("관리자가 변경되었습니다");
    setChangeOpen(false);
    navigate("/workspace");
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
        <MemberList />
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
          leadingSlot={<WarningIcon />}
        />
        <Modal
          isOpen={changeOpen}
          onClose={() => setChangeOpen(false)}
          size="lg"
          padding="lg"
          title="관리자 변경 확인"
        >
          <div className="text-center px-2 py-6 ">
            <div className="flex justify-center mb-6">
              <MessageCircleWarningIcon
                className="text-status-red"
                aria-hidden="true"
              />
            </div>
            <h3 className="font-heading2 text-text-main mb-3">
              관리자를 변경하시겠습니까?
            </h3>
            <p className="font-body1 text-text-auth-sub mb-7">
              이 조직의 소유권을 다른 멤버에게 양도합니다. <br /> 이 작업은 절대
              되돌릴 수 없습니다.
            </p>
            <Input />
            <div className="flex justify-center">
              <Button
                variant="danger"
                size="big"
                aria-label="변경하기"
                onClick={onChange}
                className="w-full md:w-auto"
                type="button"
                disabled={changing}
              >
                {changing ? "변경 중.." : "변경하기"}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </section>
  );
}
