import { type ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import type { IApiErrorResponse } from "@/types/common/common";

import { useImageUploader } from "@/hooks/common/useImageUploader";
import { useCoreQuery } from "@/hooks/customQuery";
import { useMyNotificationSettings } from "@/hooks/setting/useMyNotificationSettings";
import { useUpdateAlertsNotificationSettings } from "@/hooks/setting/useUpdateAlertsNotificationSettings";
import { useUpdateChannelNotificationSettings } from "@/hooks/setting/useUpdateChannelNotificationSettings";

import Button from "@/components/common/button/Button";
import NotificationSection from "@/components/setting/NotificationSection";
import PasswordSection from "@/components/setting/PasswordSection";
import PasswordSectionSkeleton from "@/components/setting/PasswordSectionSkeleton";
import ProfileSection from "@/components/setting/ProfileSection";
import ProfileSectionSkeleton from "@/components/setting/ProfileSectionSkeleton";

import { getMyInfo, updateMyInfo } from "@/api/auth/auth";
import { getMyWorkspaces } from "@/api/workspace/org";
import { QUERY_KEYS } from "@/lib/queryKeys";
import useWorkspaceStore from "@/store/useWorkspaceStore";

interface IChannelNotificationSettings {
  browserPush: boolean;
  emailNotif: boolean;
}

interface IWorkspaceNotificationSettings {
  clickAlarm: boolean;
  weeklyReport: boolean;
}

const DEFAULT_CHANNEL: IChannelNotificationSettings = {
  browserPush: false,
  emailNotif: false,
};

const DEFAULT_WORKSPACE_NOTIF: IWorkspaceNotificationSettings = {
  clickAlarm: false,
  weeklyReport: false,
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
  const [savedChannel, setSavedChannel] =
    useState<IChannelNotificationSettings>(DEFAULT_CHANNEL);
  const [draftChannel, setDraftChannel] =
    useState<IChannelNotificationSettings>(DEFAULT_CHANNEL);
  const [savedWorkspaceNotif, setSavedWorkspaceNotif] =
    useState<IWorkspaceNotificationSettings>(DEFAULT_WORKSPACE_NOTIF);
  const [draftWorkspaceNotif, setDraftWorkspaceNotif] =
    useState<IWorkspaceNotificationSettings>(DEFAULT_WORKSPACE_NOTIF);
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

  const selectedOrgId = useWorkspaceStore((s) => s.selectedOrgId);
  const { data: workspaces, isLoading: isWorkspacesLoading } = useCoreQuery(
    QUERY_KEYS.workspace.list(),
    getMyWorkspaces,
  );

  const {
    data: notificationSettings,
    isLoading: isNotificationLoading,
    isRefetching: isNotificationRefetching,
    isError: isNotificationError,
    error: notificationError,
    errorUpdatedAt: notificationErrorUpdatedAt,
    refetch: refetchNotificationSettings,
  } = useMyNotificationSettings();

  const lastNotifiedNotificationErrorAtRef = useRef(0);

  const currentWorkspaceName = useMemo(() => {
    if (selectedOrgId === null) return null;
    return workspaces?.find((w) => w.orgId === selectedOrgId)?.name ?? null;
  }, [selectedOrgId, workspaces]);

  const workspaceNotifiDisabled =
    selectedOrgId == null || (!isWorkspacesLoading && !currentWorkspaceName);

  const isNotificationSectionLoading =
    selectedOrgId !== null &&
    (isNotificationLoading || isNotificationRefetching);

  const updateChannels = useUpdateChannelNotificationSettings();
  const updateAlerts = useUpdateAlertsNotificationSettings();

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

  const hasChannelChanges = useMemo(() => {
    return (
      savedChannel.browserPush !== draftChannel.browserPush ||
      savedChannel.emailNotif !== draftChannel.emailNotif
    );
  }, [savedChannel, draftChannel]);

  const hasWorkspaceNotifChanges = useMemo(() => {
    return (
      savedWorkspaceNotif.clickAlarm !== draftWorkspaceNotif.clickAlarm ||
      savedWorkspaceNotif.weeklyReport !== draftWorkspaceNotif.weeklyReport
    );
  }, [savedWorkspaceNotif, draftWorkspaceNotif]);

  const hasAccountChanges = hasProfileChanges || hasPasswordChanges;

  const hasNotificationChanges = hasChannelChanges || hasWorkspaceNotifChanges;

  const hasChanges =
    hasAccountChanges || (!isNotificationError && hasNotificationChanges);

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

      const canSaveNotification = !isNotificationError;

      if (canSaveNotification && hasChannelChanges && selectedOrgId != null) {
        await updateChannels.mutateAsync({
          isBrowserPushEnabled: draftChannel.browserPush,
          isEmailEnabled: draftChannel.emailNotif,
        });
        setSavedChannel(draftChannel);
      }
      if (
        canSaveNotification &&
        hasWorkspaceNotifChanges &&
        selectedOrgId != null
      ) {
        await updateAlerts.mutateAsync({
          alertClicks: draftWorkspaceNotif.clickAlarm,
          alertReport: draftWorkspaceNotif.weeklyReport,
        });
        setSavedWorkspaceNotif(draftWorkspaceNotif);
      }

      const savedChannelThisTime =
        canSaveNotification && hasChannelChanges && selectedOrgId != null;

      const savedWorkspaceNotifiThisTime =
        canSaveNotification &&
        hasWorkspaceNotifChanges &&
        selectedOrgId != null;
      const savedAnyNotification =
        savedChannelThisTime || savedWorkspaceNotifiThisTime;

      toast.success(
        hasAccountChanges && savedAnyNotification
          ? "설정이 저장되었습니다"
          : savedAnyNotification
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

  useEffect(() => {
    //워크스페이스 미선택시에만 기본값
    if (selectedOrgId === null) {
      setSavedChannel(DEFAULT_CHANNEL);
      setDraftChannel(DEFAULT_CHANNEL);
      setSavedWorkspaceNotif(DEFAULT_WORKSPACE_NOTIF);
      setDraftWorkspaceNotif(DEFAULT_WORKSPACE_NOTIF);
      return;
    }

    if (!notificationSettings) return; //로딩,에러면 손대지 않음

    const nextChannel = {
      browserPush: notificationSettings.isBrowserPushEnabled,
      emailNotif: notificationSettings.isEmailEnabled,
    };
    const nextWorkspace = {
      clickAlarm: notificationSettings.alertClicks,
      weeklyReport: notificationSettings.alertReport,
    };

    setSavedChannel(nextChannel);
    setDraftChannel(nextChannel);
    setSavedWorkspaceNotif(nextWorkspace);
    setDraftWorkspaceNotif(nextWorkspace);
  }, [selectedOrgId, notificationSettings]);

  useEffect(() => {
    if (!isNotificationError || notificationErrorUpdatedAt === 0) return;
    if (
      lastNotifiedNotificationErrorAtRef.current === notificationErrorUpdatedAt
    )
      return;

    lastNotifiedNotificationErrorAtRef.current = notificationErrorUpdatedAt;
    toast.error(
      notificationError?.message ?? "알림 설정을 불러오는데 실패했습니다",
    );
  }, [isNotificationError, notificationError, notificationErrorUpdatedAt]);

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

        {isLoading || isNotificationSectionLoading ? (
          <div className="animate-pulse h-64 rounded-lg bg-surface-200" />
        ) : isNotificationError ? (
          <div className="flex min-h-40 flex-col items-center justify-center gap-4 rounded-lg bg-surface-100 p-8">
            <p className="text-center font-body2 text-text-muted">
              {notificationError?.message ??
                "알림 설정을 불러오지 못했습니다. 잠시 후에 다시 시도해주세요"}
            </p>
            <Button
              variant="outline"
              size="small"
              type="button"
              onClick={() => {
                refetchNotificationSettings();
              }}
            >
              다시 시도
            </Button>
          </div>
        ) : (
          <NotificationSection
            email={draftProfile.email}
            browserPush={draftChannel.browserPush}
            emailNotif={draftChannel.emailNotif}
            onBrowserPushChange={(value) =>
              setDraftChannel((prev) => ({ ...prev, browserPush: value }))
            }
            onEmailNotifChange={(value) =>
              setDraftChannel((prev) => ({ ...prev, emailNotif: value }))
            }
            workspaceName={currentWorkspaceName}
            clickAlarm={draftWorkspaceNotif.clickAlarm}
            weeklyReport={draftWorkspaceNotif.weeklyReport}
            onClickAlarmChange={(value) =>
              setDraftWorkspaceNotif((prev) => ({ ...prev, clickAlarm: value }))
            }
            onWeeklyReportChange={(value) =>
              setDraftWorkspaceNotif((prev) => ({
                ...prev,
                weeklyReport: value,
              }))
            }
            workspaceNotifiDisabled={workspaceNotifiDisabled}
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
          disabled={!hasChanges || isLoading || isNotificationSectionLoading}
        >
          변경사항 저장하기
        </Button>
      </div>
    </section>
  );
}
