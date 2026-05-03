import LockIcon from "@/assets/icon/common/lock.svg?react";

export default function PasswordSection() {
  return (
    <div className="bg-white border border-gray-100 rounded-component-lg p-8 shadow-Soft">
      <header className="mb-7 flex items-start justify-between gap-4">
        <div>
          <div className="flex gap-4 items-center">
            <LockIcon />
            <h2 className="font-heading4 text-text-main font-semibold!">
              비밀번호 변경
            </h2>
          </div>

          <p className="font-body2 text-text-sub mt-2">
            영문, 숫자, 특수문자가 모두 포함된 8~16자리의 비밀번호를 설정해
            주세요
          </p>
        </div>
      </header>
    </div>
  );
}
