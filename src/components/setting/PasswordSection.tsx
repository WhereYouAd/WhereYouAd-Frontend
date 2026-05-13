import { useState } from "react";

import Input from "../common/input/Input";

import EyeIcon from "@/assets/icon/common/eye.svg?react";
import EyeOffIcon from "@/assets/icon/common/eye-off.svg?react";
import LockIcon from "@/assets/icon/common/lock.svg?react";

type TPasswordSectionProps = {
  currentPassword: string;
  setCurrentPassword: (v: string) => void;
  newPassword: string;
  setNewPassword: (v: string) => void;
  confirmNewPassword: string;
  setConfirmNewPassword: (v: string) => void;
  errors: {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
  };
};

export default function PasswordSection({
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  confirmNewPassword,
  setConfirmNewPassword,
  errors,
}: TPasswordSectionProps) {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-Soft">
      <header className="mb-7 flex items-start justify-between gap-4">
        <div>
          <div className="flex gap-4 items-center">
            <LockIcon />
            <h2 className="font-heading4 text-text-main font-semibold!">
              비밀번호 변경
            </h2>
          </div>

          <p className="font-body2 text-text-sub mt-2">
            안전한 계정 사용을 위해 주기적인 비밀번호 변경을 권장합니다
            <br /> 영문, 숫자, 특수문자가 모두 포함된 8~16자리의 비밀번호를
            설정해 주세요
          </p>
        </div>
      </header>
      <div className="grid grid-cols-1 tablet:grid-cols-1 gap-x-8 gap-y-6 tablet:max-w-4xl">
        <div className="tablet:col-span-1">
          <Input
            type={showCurrent ? "text" : "password"}
            label="현재 비밀번호"
            placeholder="기존 비밀번호를 입력하세요"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            error={!!errors.currentPassword}
            helperText={errors.currentPassword}
            rightElement={
              <button type="button" onClick={() => setShowCurrent((p) => !p)}>
                {showCurrent ? (
                  <EyeOffIcon className="w-5 h-auto text-text-muted" />
                ) : (
                  <EyeIcon className="w-5 h-auto text-text-muted" />
                )}
              </button>
            }
          />
        </div>

        <Input
          type={showNew ? "text" : "password"}
          label="새 비밀번호"
          placeholder="8~16자 영문, 숫자, 특수문자"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          error={!!errors.newPassword}
          helperText={errors.newPassword}
          rightElement={
            <button
              type="button"
              aria-label={
                showCurrent ? "현재 비밀번호 숨기기" : "현재 비밀번호 보기"
              }
              aria-pressed={showCurrent}
              onClick={() => setShowNew((p) => !p)}
            >
              {showNew ? (
                <EyeOffIcon className="w-5 h-auto text-text-muted" />
              ) : (
                <EyeIcon className="w-5 h-auto text-text-muted" />
              )}
            </button>
          }
        />
        <Input
          type={showConfirm ? "text" : "password"}
          label="새 비밀번호 확인"
          placeholder="한 번 더 입력하세요"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
          error={!!errors.confirmNewPassword}
          helperText={errors.confirmNewPassword}
          rightElement={
            <button type="button" onClick={() => setShowConfirm((p) => !p)}>
              {showConfirm ? (
                <EyeOffIcon className="w-5 h-auto text-text-muted" />
              ) : (
                <EyeIcon className="w-5 h-auto text-text-muted" />
              )}
            </button>
          }
        />
      </div>
    </div>
  );
}
