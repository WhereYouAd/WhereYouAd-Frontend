import Button from "../common/button/Button";

import PlusIcon from "@/assets/icon/workspace/plus.svg?react";

export default function MemberList() {
  return (
    <div className="bg-white border border-gray-100 rounded-component-lg p-8 shadow-Soft">
      <header className="mb-7 flex justify-between">
        <div>
          <h2 className="font-heading4 text-text-main !font-semibold">
            팀 구성원
          </h2>
          <p className="font-body2 text-text-sub mt-2">
            현재 4명의 구성원이 활동 중입니다
          </p>
        </div>
        <Button
          type="button"
          variant="primary"
          size="small"
          aria-label="업로드"
          onClick={() => alert("TODO:버튼")}
          // disabled={}
          className="p-5 py-6 rounded-component-md"
        >
          <PlusIcon className="w-3 h-3 fill-white" />
          팀원 초대
        </Button>
      </header>

      <div>컨텐츠section</div>
    </div>
  );
}
