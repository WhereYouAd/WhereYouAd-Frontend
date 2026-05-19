import { type ChangeEvent, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import type { IApiErrorResponse } from "@/types/common/common";

import { useImageUploader } from "@/hooks/common/useImageUploader";

import Button from "@/components/common/button/Button";
import NotificationSection, {
  type INotificationSettings,
} from "@/components/setting/NotificationSection";
import PasswordSection from "@/components/setting/PasswordSection";
import PasswordSectionSkeleton from "@/components/setting/PasswordSectionSkeleton";
import ProfileSection from "@/components/setting/ProfileSection";
import ProfileSectionSkeleton from "@/components/setting/ProfileSectionSkeleton";

import { getMyInfo, updateMyInfo } from "@/api/auth/auth";

const DEFAULT_NOTIFICATION_SETTINGS: INotificationSettings = {
  browserPush: false,
  emailNotif: false,
};

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
  const [savedNotification, setSavedNotification] =
    useState<INotificationSettings>(DEFAULT_NOTIFICATION_SETTINGS);
  const [draftNotification, setDraftNotification] =
    useState<INotificationSettings>(DEFAULT_NOTIFICATION_SETTINGS);
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

  const hasNotificationChanges = useMemo(() => {
    return (
      savedNotification.browserPush !== draftNotification.browserPush ||
      savedNotification.emailNotif !== draftNotification.emailNotif
    );
  }, [savedNotification, draftNotification]);

  const hasAccountChanges = hasProfileChanges || hasPasswordChanges;

  const hasChanges = hasAccountChanges || hasNotificationChanges;

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
      if (hasAccountChanges) {
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
        setIsImageDeleted(false);
      }

      if (hasNotificationChanges) {
        setSavedNotification(draftNotification);
        // TODO: 알림 설정 API 연동
      }

      toast.success(
        hasAccountChanges && hasNotificationChanges
          ? "설정이 저장되었습니다"
          : hasNotificationChanges
            ? "알림 설정이 저장되었습니다"
            : "회원정보가 수정되었습니다",
      );
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
      <div className="flex flex-col gap-6">
        {isLoading ? (
          <ProfileSectionSkeleton />
        ) : (
          <ProfileSection
            name={draftProfile.name}
            setName={(v) => setDraftProfile((prev) => ({ ...prev, name: v }))}
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

        {isLoading ? (
          <div className="animate-pulse h-64 bg-surface-200 rounded-lg" />
        ) : (
          <NotificationSection
            email={draftProfile.email}
            browserPush={draftNotification.browserPush}
            emailNotif={draftNotification.emailNotif}
            onBrowserPushChange={(value) =>
              setDraftNotification((prev) => ({ ...prev, browserPush: value }))
            }
            onEmailNotifChange={(value) =>
              setDraftNotification((prev) => ({ ...prev, emailNotif: value }))
            }
          />
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
