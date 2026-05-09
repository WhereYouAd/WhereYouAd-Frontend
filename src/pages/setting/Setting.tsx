import { type ChangeEvent, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import type { IApiErrorResponse } from "@/types/common/common";

import { useImageUploader } from "@/hooks/common/useImageUploader";

import Button from "@/components/common/button/Button";
import PasswordSection from "@/components/setting/PasswordSection";
import ProfileSection from "@/components/setting/ProfileSection";

import { getMyInfo, updateMyInfo } from "@/api/auth/auth";

export default function Setting() {
  const [savedProfile, setSavedProfile] = useState({
    name: "",
    profileImageUrl: null as string | null,
  });
  const [draftProfile, setDraftProfile] = useState({
    name: "",
    organizations: [],
    email: "",
    phoneNumber: "",
  });
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isImageDeleted, setIsImageDeleted] = useState(false);
  const {
    fileRef,
    file,
    preview,
    setPreview,
    openFilePicker,
    onPickFile,
    resetImage,
  } = useImageUploader();

  const handlePickFile = (e: ChangeEvent<HTMLInputElement>) => {
    setIsImageDeleted(false);
    onPickFile(e);
  };

  const hasPasswordChanges =
    !!currentPassword || !!newPassword || !!confirmNewPassword;

  const hasChanges = useMemo(() => {
    return (
      savedProfile.name !== draftProfile.name ||
      savedProfile.profileImageUrl !== preview ||
      !!file ||
      hasPasswordChanges
    );
  }, [savedProfile, draftProfile, preview, file, hasPasswordChanges]);

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

  const handleSave = async () => {
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
    try {
      const res = await updateMyInfo({
        name: draftProfile.name,
        oldPassword: currentPassword || undefined,
        newPassword: newPassword || undefined,
        isImageDeleted,
        imageFile: file,
      });
      setSavedProfile({
        name: res.data.name,
        profileImageUrl: res.data.profileImageUrl,
      });
      setDraftProfile((prev) => ({
        ...prev,
        name: res.data.name,
      }));
      setPreview(res.data.profileImageUrl);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      toast.success("회원정보가 수정되었습니다");
      setIsImageDeleted(false);
    } catch (e) {
      const error = e as IApiErrorResponse;
      toast.error(error.message ?? "회원정보수정에 실패했습니다");
    }
  };

  const fetchMyInfo = async () => {
    try {
      const res = await getMyInfo();

      const profileData = {
        name: res.data.name,
        // organizations: res.data.organizations?.map((org) => ({
        //   name: org.organizationName,
        //   position: org.position,
        // })) ?? [],
        organizations: [],
        email: res.data.email,
        phoneNumber: res.data.phoneNumber,
      };
      setSavedProfile({
        name: res.data.name,
        profileImageUrl: res.data.profileImageUrl,
      });
      setDraftProfile(profileData);
      setPreview(res.data.profileImageUrl);
    } catch (error) {
      toast.error("회원 정보를 불러오는데 실패했습니다");
      console.log(error);
    }
  };
  useEffect(() => {
    fetchMyInfo();
  }, []);
  return (
    <section className="w-full flex flex-col gap-8">
      <div className="flex flex-col gap-6">
        <ProfileSection
          name={draftProfile.name}
          setName={(v) => setDraftProfile((prev) => ({ ...prev, name: v }))}
          organizations={draftProfile.organizations}
          email={draftProfile.email}
          phoneNumber={draftProfile.phoneNumber}
          fileRef={fileRef}
          preview={preview}
          onPickFile={handlePickFile}
          openFilePicker={openFilePicker}
          resetImage={() => {
            resetImage();
            setIsImageDeleted(true);
          }}
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
