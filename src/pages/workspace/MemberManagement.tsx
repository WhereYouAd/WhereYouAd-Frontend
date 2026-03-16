import ControlBox from "@/components/common/controlbox/ControlBox";
import MemberList from "@/components/workspace/MemberList";
import PermissionTable from "@/components/workspace/PermissionTable";

import WarnCircleIcon from "@/assets/icon/common/warn-circle.svg?react";

export default function MemberManagement() {
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
          onButtonClick={() => alert("TODO:소유권이전버튼클릭")}
          className="w-full min-w-0"
          containerClassName="bg-status-red/10 border-status-red"
          titleClassName="text-status-red"
          descriptionClassName="text-text-auth-sub"
          buttonVariant="dangerSoft"
          buttonSize="big"
          buttonClassName="px-8 !rounded-component-md"
          // buttonDisabled={}
          leadingSlot={<WarnCircleIcon />}
        />
      </div>
    </section>
  );
}
