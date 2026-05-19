import { type ChangeEvent, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

import type { IApiErrorResponse } from "@/types/common/common";

import { useImageUploader } from "@/hooks/common/useImageUploader";

import Button from "@/components/common/button/Button";
import NotificationSection from "@/components/setting/NotificationSection";
import PasswordSection from "@/components/setting/PasswordSection";
import PasswordSectionSkeleton from "@/components/setting/PasswordSectionSkeleton";
import ProfileSection from "@/components/setting/ProfileSection";
import ProfileSectionSkeleton from "@/components/setting/ProfileSectionSkeleton";

import { getMyInfo, updateMyInfo } from "@/api/auth/auth";

type TSettingTab = "profile" | "security" | "notifications";

const TABS: { id: TSettingTab; label: string }[] = [
  { id: "profile", label: "프로필" },
  { id: "security", label: "보안" },
  { id: "notifications", label: "알림" },
];

interface IDraftProfile {
  name: string;
  email: string;
  phoneNumber: string;
}

interface ISavedProfile {
  name: string;
  profileImageUrl: string | null;
}

export default function Setting() {
  const [activeTab, setActiveTab] = useState<TSettingTab>("profile");
  const [savedProfile, setSavedProfile] = useState<ISavedProfile>({
    name: "",
    profileImageUrl: null,
  });
  const [draftProfile, setDraftProfile] = useState<IDraftProfile>({
    name: "",
    email: "",
    phoneNumber: "",
  });
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isImageDeleted, setIsImageDeleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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

  const hasProfileChanges = useMemo(() => {
    return (
      savedProfile.name !== draftProfile.name ||
      savedProfile.profileImageUrl !== preview ||
      !!file
    );
  }, [savedProfile, draftProfile, preview, file]);

  const hasChanges = useMemo(() => {
    switch (activeTab) {
      case "profile":
        return hasProfileChanges;
      case "security":
        return hasPasswordChanges;
      case "notifications":
        //TODO: API연동 후 알림 설정 변경 감지 추가
        return false;
      default:
        return false;
    }
  }, [activeTab, hasProfileChanges, hasPasswordChanges]);

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

  useEffect(() => {
    const fetchMyInfo = async () => {
      try {
        setIsLoading(true);
        const res = await getMyInfo();

        const profileData = {
          name: res.data.name,
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
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMyInfo();
  }, [setPreview]);

  return (
    <section className="w-full flex flex-col gap-8">
      <nav aria-label="설정 탭" className="flex border-b border-surface-300">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={twMerge(
              "px-5 py-3 font-body1 transition-colors duration-200 border-b-2 -mb-px",
              activeTab === tab.id
                ? "border-primary-400 text-primary-400"
                : "border-transparent text-text-muted hover:text-text-title",
            )}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <div className="flex flex-col gap-6">
        {activeTab === "profile" && (
          <>
            {isLoading ? (
              <ProfileSectionSkeleton />
            ) : (
              <ProfileSection
                name={draftProfile.name}
                setName={(v) =>
                  setDraftProfile((prev) => ({ ...prev, name: v }))
                }
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
            )}
          </>
        )}

        {activeTab === "security" && (
          <>
            {isLoading ? (
              <PasswordSectionSkeleton />
            ) : (
              <PasswordSection
                currentPassword={currentPassword}
                setCurrentPassword={setCurrentPassword}
                newPassword={newPassword}
                setNewPassword={setNewPassword}
                confirmNewPassword={confirmNewPassword}
                setConfirmNewPassword={setConfirmNewPassword}
                errors={passwordErrors}
              />
            )}
          </>
        )}

        {activeTab === "notifications" && (
          <>
            {isLoading ? (
              <div className="animate-pulse h-64 bg-surface-200 rounded-lg" />
            ) : (
              <NotificationSection email={draftProfile.email} />
            )}
          </>
        )}
      </div>

      <div className="flex justify-end">
        <Button
          variant="primary"
          type="button"
          size="big"
          aria-label="개인 설정 변경사항 저장 버튼"
          onClick={handleSave}
          disabled={!hasChanges || isLoading}
        >
          변경사항 저장하기
        </Button>
      </div>
    </section>
  );
}
