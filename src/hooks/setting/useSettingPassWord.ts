import { useState } from "react";

const EMPTY_ERRORS = {
  currentPassword: "",
  newPassword: "",
  confirmNewPassword: "",
};
export default function useSettingPassWord() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState(EMPTY_ERRORS);

  const hasPasswordChanges =
    !!currentPassword || !!newPassword || !!confirmNewPassword;

  const validatePassword = () => {
    const errors = { ...EMPTY_ERRORS };

    if (!currentPassword) {
      errors.currentPassword = "현재 비밀번호를 입력해주세요";
    }
    if (
      !newPassword.match(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,16}$/)
    ) {
      errors.newPassword =
        "영문, 숫자, 특수문자를 포함하여 8~16자로 입력해주세요";
    }
    if (currentPassword && newPassword && currentPassword === newPassword) {
      errors.newPassword = "현재 비밀번호와 다른 비밀번호를 입력해주세요";
    }
    if (newPassword !== confirmNewPassword) {
      errors.confirmNewPassword = "새 비밀번호가 일치하지 않습니다";
    }
    setPasswordErrors(errors);
    return !Object.values(errors).some(Boolean);
  };

  const clearPasswordErrors = () => {
    setPasswordErrors(EMPTY_ERRORS);
  };
  const clearPassword = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
  };

  return {
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmNewPassword,
    setConfirmNewPassword,
    passwordErrors,
    hasPasswordChanges,
    validatePassword,
    clearPasswordErrors,
    clearPassword,
  };
}
