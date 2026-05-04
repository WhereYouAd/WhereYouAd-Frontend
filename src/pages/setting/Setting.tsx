import { useMemo, useState } from "react";

import { useImageUploader } from "@/hooks/common/useImageUploader";

import Button from "@/components/common/button/Button";
import PageHeader from "@/components/common/PageHeader";
import PasswordSection from "@/components/setting/PasswordSection";
import ProfileSection from "@/components/setting/ProfileSection";

export default function Setting() {
  const [savedProfile, setSavedProfile] = useState({
    name: "",
    organizations: [
      { name: "CJ", position: "FE developer" },
      { name: "SMU창업팀", position: "팀장" },
      { name: "상명대학교", position: "학생" },
    ],
    email: "whereyouadofficial@gmail.com",
    phoneNumber: "010-1234-5678",
    image: null as File | null,
  });
  const [draftProfile, setDraftProfile] = useState(savedProfile);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const { fileRef, /*file,*/ preview, openFilePicker, onPickFile, resetImage } =
    useImageUploader();

  const hasPasswordChanges =
    !!currentPassword || !!newPassword || !!confirmNewPassword;

  const hasChanges = useMemo(() => {
    return savedProfile.image !== draftProfile.image || hasPasswordChanges;
  }, [savedProfile, draftProfile, hasPasswordChanges]);

  const [passwordErrors, setPasswordErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const validatePassword = () => {
    const errors = {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    };
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
    return errors;
  };

  const handleSave = () => {
    if (hasPasswordChanges) {
      const errors = validatePassword();
      setPasswordErrors(errors);
      if (Object.values(errors).some(Boolean)) return;
    } else {
      setPasswordErrors({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    }
    console.log(draftProfile);
    setSavedProfile(draftProfile);
  };
  return (
    <section className="w-full flex flex-col gap-8">
      <PageHeader
        title="개인 설정"
        description="개인 프로필 정보와 비밀번호를 이곳에서 통합하여 관리할 수 있습니다"
      />
      <div className="flex flex-col gap-6">
        <ProfileSection
          name={draftProfile.name}
          setName={(v) => setDraftProfile((prev) => ({ ...prev, name: v }))}
          organizations={draftProfile.organizations}
          email={draftProfile.email}
          phoneNumber={draftProfile.phoneNumber}
          fileRef={fileRef}
          preview={preview}
          onPickFile={onPickFile}
          openFilePicker={openFilePicker}
          resetImage={resetImage}
        />
        <PasswordSection
          currentPassword={currentPassword}
          setCurrentPassword={setCurrentPassword}
          newPassword={newPassword}
          setNewPassword={setNewPassword}
          confirmNewPassword={confirmNewPassword}
          setConfirmNewPassword={setConfirmNewPassword}
          errors={passwordErrors}
        />
      </div>
      <div className="flex justify-end">
        <Button
          variant="primary"
          type="button"
          size="big"
          aria-label="개인 설정 변경사항 저장 버튼"
          onClick={handleSave}
          disabled={!hasChanges}
        >
          변경사항 저장하기
        </Button>
      </div>
    </section>
  );
}
