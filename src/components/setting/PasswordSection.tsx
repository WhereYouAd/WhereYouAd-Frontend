import { useState } from "react";

import Input from "../common/input/Input";

import LockIcon from "@/assets/icon/common/lock.svg?react";

export default function PasswordSection() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
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
      <div className="flex flex-col gap-3">
        <div className="w-94">
          <Input
            label="현재 비밀번호"
            placeholder="현재 비밀번호를 입력하세요"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>

        <div className="flex gap-7">
          <Input
            label="새 비밀번호"
            placeholder="새 비밀번호를 입력하세요"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Input
            label="새 비밀번호 확인"
            placeholder="한번 더 입력해주세요"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
