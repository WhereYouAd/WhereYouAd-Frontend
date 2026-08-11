import { type ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import type { IApiErrorResponse } from "@/types/common/common";
import type { IUpdateOrgNotificationSettingsRequest } from "@/types/setting/notification";

import { useDeleteMyAccount } from "@/hooks/auth/useDeleteMyAccount";
import { useImageUploader } from "@/hooks/common/useImageUploader";
import { useCoreQuery } from "@/hooks/customQuery";
import { useMyNotificationSettings } from "@/hooks/setting/useMyNotificationSettings";
import { useUpdateAlertsNotificationSettings } from "@/hooks/setting/useUpdateAlertsNotificationSettings";
import { useUpdateChannelNotificationSettings } from "@/hooks/setting/useUpdateChannelNotificationSettings";
import { useUpdateMasterNotificationSettings } from "@/hooks/setting/useUpdateMasterNotificationSetting";
import { useUpdateOrgNotificationSettings } from "@/hooks/setting/useUpdateOrgNotificationSettings";

import Button from "@/components/common/button/Button";
import AreaErrorFallback from "@/components/common/error/AreaErrorFallback";
import { ErrorBoundary } from "@/components/common/error/ErrorBoundary";
import NotificationSection from "@/components/setting/NotificationSection";
import PasswordSection from "@/components/setting/PasswordSection";
import PasswordSectionSkeleton from "@/components/setting/PasswordSectionSkeleton";
import ProfileSection from "@/components/setting/ProfileSection";
import ProfileSectionSkeleton from "@/components/setting/ProfileSectionSkeleton";
import WithdrawConfirmModal from "@/components/setting/WithdrawConfirmModal";

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

interface IOrgNotificationSettings {
  masterEnabled: boolean;
  slackEnabled: boolean;
  slackConnected: boolean;
  discordEnabled: boolean;
  discordConnected: boolean;
}

const DEFAULT_CHANNEL: IChannelNotificationSettings = {
  browserPush: false,
  emailNotif: false,
};

const DEFAULT_WORKSPACE_NOTIF: IWorkspaceNotificationSettings = {
  clickAlarm: false,
  weeklyReport: false,
};

const DEFAULT_ORG_NOTIF: IOrgNotificationSettings = {
  masterEnabled: true,
  slackEnabled: false,
  slackConnected: false,
  discordEnabled: false,
  discordConnected: false,
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
  const [savedOrgNotif, setSavedOrgNotif] =
    useState<IOrgNotificationSettings>(DEFAULT_ORG_NOTIF);
  const [draftOrgNotif, setDraftOrgNotif] =
    useState<IOrgNotificationSettings>(DEFAULT_ORG_NOTIF);

  const [slackWebhookUrl, setSlackWebhookUrl] = useState("");
  const [slackWebhookError, setSlackWebhookError] = useState("");
  const [discordWebhookUrl, setDiscordWebhookUrl] = useState("");
  const [discordWebhookError, setDiscordWebhookError] = useState("");
  const [pendingOrgAction, setPendingOrgAction] = useState<
    "slack" | "discord" | null
  >(null);

  const [isImageDeleted, setIsImageDeleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

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

  const myRole = useWorkspaceStore((s) => s.myRole);
  const isAdmin = myRole === "ADMIN";

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
  const isSavingRef = useRef(false);

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
  const updateOrg = useUpdateOrgNotificationSettings();
  const updateMaster = useUpdateMasterNotificationSettings();

  const { mutate: deleteMyAccountMutate, isPending: isWithdrawPending } =
    useDeleteMyAccount();

  const buildOrgBody = (
    overrides: Partial<IUpdateOrgNotificationSettingsRequest> = {},
  ): IUpdateOrgNotificationSettingsRequest => ({
    isSlackEnabled: draftOrgNotif.slackEnabled,
    slackWebhookUrl: "",
    disconnectSlack: false,
    isDiscordEnabled: draftOrgNotif.discordEnabled,
    discordWebhookUrl: "",
    disconnectDiscord: false,
    alertClicks: draftWorkspaceNotif.clickAlarm ?? false,
    alertReport: draftWorkspaceNotif.weeklyReport ?? false,
    ...overrides,
  });

  const handlePickFile = (e: ChangeEvent<HTMLInputElement>) => {
    setIsImageDeleted(false);
    onPickFile(e);
  };

  const handleConnectSlack = async () => {
    const url = slackWebhookUrl.trim();
    if (!url) {
      setSlackWebhookError("Webhook URL을 입력해주세요");
      return;
    }
    if (!url.startsWith("https://")) {
      setSlackWebhookError("올바른 URL 형식으로 입력해주세요");
      return;
    }

    setPendingOrgAction("slack");
    try {
      await updateOrg.mutateAsync(
        buildOrgBody({
          isSlackEnabled: true,
          slackWebhookUrl: url,
          disconnectSlack: false,
        }),
      );
      toast.success("슬랙이 연동되었습니다");
      setSlackWebhookUrl("");
      setSlackWebhookError("");
    } catch (e) {
      const error = e as IApiErrorResponse;
      toast.error(error.message ?? "슬랙 연동에 실패했습니다");
    } finally {
      setPendingOrgAction(null);
    }
  };

  const handleDisconnectSlack = async () => {
    setPendingOrgAction("slack");
    try {
      await updateOrg.mutateAsync(
        buildOrgBody({
          isSlackEnabled: false,
          slackWebhookUrl: "",
          disconnectSlack: true,
        }),
      );
      toast.success("슬랙 연동이 해제되었습니다");
    } catch (e) {
      const error = e as IApiErrorResponse;
      toast.error(error.message ?? "슬랙 연동 해제에 실패했습니다");
    } finally {
      setPendingOrgAction(null);
    }
  };

  const handleConnectDiscord = async () => {
    const url = discordWebhookUrl.trim();
    if (!url) {
      setDiscordWebhookError("Webhook URL을 입력해주세요");
      return;
    }
    if (!url.startsWith("https://")) {
      setDiscordWebhookError("올바른 URL 형식으로 입력해주세요");
      return;
    }

    setPendingOrgAction("discord");
    try {
      await updateOrg.mutateAsync(
        buildOrgBody({
          isDiscordEnabled: true,
          discordWebhookUrl: url,
          disconnectDiscord: false,
        }),
      );
      toast.success("디스코드가 연동되었습니다");
      setDiscordWebhookUrl("");
      setDiscordWebhookError("");
    } catch (e) {
      const error = e as IApiErrorResponse;
      toast.error(error.message ?? "디스코드 연동에 실패했습니다");
    } finally {
      setPendingOrgAction(null);
    }
  };

  const handleDisconnectDiscord = async () => {
    setPendingOrgAction("discord");
    try {
      await updateOrg.mutateAsync(
        buildOrgBody({
          isDiscordEnabled: false,
          discordWebhookUrl: "",
          disconnectDiscord: true,
        }),
      );
      toast.success("디스코드 연동이 해제되었습니다");
    } catch (e) {
      const error = e as IApiErrorResponse;
      toast.error(error.message ?? "디스코드 연동 해제에 실패했습니다");
    } finally {
      setPendingOrgAction(null);
    }
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

  const hasMasterChanges =
    savedOrgNotif.masterEnabled !== draftOrgNotif.masterEnabled;

  const hasOrgToggleChanges =
    savedOrgNotif.slackEnabled !== draftOrgNotif.slackEnabled ||
    savedOrgNotif.discordEnabled !== draftOrgNotif.discordEnabled;

  const hasAccountChanges = hasProfileChanges || hasPasswordChanges;

  const hasNotificationChanges =
    hasChannelChanges ||
    hasWorkspaceNotifChanges ||
    hasMasterChanges ||
    hasOrgToggleChanges;

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
    if (isSavingRef.current) return;

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

    isSavingRef.current = true;
    setIsSaving(true);

    let savedAccount = false;
    let savedAnyNotification = false;

    try {
      if (hasAccountChanges) {
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
          setIsImageDeleted(false);
          savedAccount = true;
        } catch (e) {
          const error = e as IApiErrorResponse;
          toast.error(error.message ?? "회원정보수정에 실패했습니다");
          return;
        }
      }

      const canSaveNotification = !isNotificationError;
      const shouldSaveChannel =
        canSaveNotification && hasChannelChanges && selectedOrgId != null;
      const shouldSaveAlerts =
        canSaveNotification &&
        hasWorkspaceNotifChanges &&
        selectedOrgId != null;

      const shouldSaveMaster =
        canSaveNotification && hasMasterChanges && selectedOrgId != null;
      const shouldSaveOrg =
        canSaveNotification &&
        hasOrgToggleChanges &&
        selectedOrgId != null &&
        isAdmin;

      if (
        shouldSaveChannel ||
        shouldSaveAlerts ||
        shouldSaveMaster ||
        shouldSaveOrg
      ) {
        const savedSteps: string[] = [];
        try {
          if (shouldSaveChannel) {
            await updateChannels.mutateAsync({
              isBrowserPushEnabled: draftChannel.browserPush,
              isEmailEnabled: draftChannel.emailNotif,
            });
            setSavedChannel(draftChannel);
            savedSteps.push("알림 채널");
          }
          if (shouldSaveAlerts) {
            await updateAlerts.mutateAsync({
              alertClicks: draftWorkspaceNotif.clickAlarm,
              alertReport: draftWorkspaceNotif.weeklyReport,
            });
            setSavedWorkspaceNotif(draftWorkspaceNotif);
            savedSteps.push("워크스페이스 알림");
          }
          if (shouldSaveMaster) {
            await updateMaster.mutateAsync({
              isMasterEnabled: draftOrgNotif.masterEnabled,
            });
            setSavedOrgNotif((prev) => ({
              ...prev,
              masterEnabled: draftOrgNotif.masterEnabled,
            }));
            savedSteps.push("마스터 알림");
          }
          if (shouldSaveOrg) {
            await updateOrg.mutateAsync(
              buildOrgBody({
                isSlackEnabled: draftOrgNotif.slackEnabled,
                slackWebhookUrl: "",
                disconnectSlack: false,
                isDiscordEnabled: draftOrgNotif.discordEnabled,
                discordWebhookUrl: "",
                disconnectDiscord: false,
              }),
            );
            setSavedOrgNotif((prev) => ({
              ...prev,
              slackEnabled: draftOrgNotif.slackEnabled,
              discordEnabled: draftOrgNotif.discordEnabled,
            }));
            savedSteps.push("슬랙/디스코드 설정");
          }
          savedAnyNotification = true;
        } catch (e) {
          const error = e as IApiErrorResponse;
          if (savedAccount) {
            toast.success("회원정보가 수정되었습니다");
          }
          toast.error(
            savedSteps.length > 0
              ? `${savedSteps.join(", ")}은(는) 저장됐지만, 이후 단계에서 실패했습니다`
              : (error.message ?? "알림 설정 저장에 실패했습니다"),
          );
          return;
        }
      }

      if (savedAccount || savedAnyNotification) {
        toast.success(
          savedAccount && savedAnyNotification
            ? "설정이 저장되었습니다"
            : savedAnyNotification
              ? "알림 설정이 저장되었습니다"
              : "회원정보가 수정되었습니다",
        );
      }
    } finally {
      isSavingRef.current = false;
      setIsSaving(false);
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
      setSavedOrgNotif(DEFAULT_ORG_NOTIF);
      setDraftOrgNotif(DEFAULT_ORG_NOTIF);
      setSlackWebhookUrl("");
      setSlackWebhookError("");
      setDiscordWebhookUrl("");
      setDiscordWebhookError("");
      return;
    }

    if (!notificationSettings) return; //로딩,에러면 손대지 않음

    const masterOn = notificationSettings.isMasterEnabled;
    const nextChannel = {
      browserPush: masterOn && notificationSettings.isBrowserPushEnabled,
      emailNotif: masterOn && notificationSettings.isEmailEnabled,
    };
    const nextWorkspace = {
      clickAlarm: masterOn && notificationSettings.alertClicks,
      weeklyReport: masterOn && notificationSettings.alertReport,
    };
    const nextOrg = {
      masterEnabled: masterOn,
      slackEnabled: masterOn && notificationSettings.isSlackEnabled,
      slackConnected: notificationSettings.isSlackConnected,
      discordEnabled: masterOn && notificationSettings.isDiscordEnabled,
      discordConnected: notificationSettings.isDiscordConnected,
    };

    setSavedChannel(nextChannel);
    setDraftChannel(nextChannel);
    setSavedWorkspaceNotif(nextWorkspace);
    setDraftWorkspaceNotif(nextWorkspace);
    setSavedOrgNotif(nextOrg);
    setDraftOrgNotif(nextOrg);
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
          <ErrorBoundary
            FallbackComponent={AreaErrorFallback}
            resetKeys={[draftOrgNotif, draftChannel, draftWorkspaceNotif]}
          >
            <NotificationSection
              email={draftProfile.email}
              isAdmin={isAdmin}
              masterEnabled={draftOrgNotif.masterEnabled}
              onMasterEnabledChange={(value) => {
                if (!value) {
                  setDraftOrgNotif((prev) => ({
                    ...prev,
                    masterEnabled: false,
                    slackEnabled: false,
                    discordEnabled: false,
                  }));
                  setDraftChannel({ browserPush: false, emailNotif: false });
                  setDraftWorkspaceNotif({
                    clickAlarm: false,
                    weeklyReport: false,
                  });
                  return;
                }
                setDraftOrgNotif((prev) => ({
                  ...prev,
                  masterEnabled: true,
                  slackEnabled:
                    prev.slackConnected && savedOrgNotif.slackEnabled,
                  discordEnabled:
                    prev.discordConnected && savedOrgNotif.discordEnabled,
                }));
                setDraftChannel(savedChannel);
                setDraftWorkspaceNotif(savedWorkspaceNotif);
              }}
              browserPush={draftChannel.browserPush}
              emailNotif={draftChannel.emailNotif}
              onBrowserPushChange={(value) =>
                setDraftChannel((prev) => ({ ...prev, browserPush: value }))
              }
              onEmailNotifChange={(value) =>
                setDraftChannel((prev) => ({ ...prev, emailNotif: value }))
              }
              slackEnabled={draftOrgNotif.slackEnabled}
              slackConnected={draftOrgNotif.slackConnected}
              slackWebhookUrl={slackWebhookUrl}
              slackWebhookError={slackWebhookError}
              onSlackWebhookUrlChange={(value) => {
                setSlackWebhookUrl(value);
                if (slackWebhookError) setSlackWebhookError("");
              }}
              onSlackEnabledChange={(value) =>
                setDraftOrgNotif((prev) => ({ ...prev, slackEnabled: value }))
              }
              onConnectSlack={handleConnectSlack}
              onDisconnectSlack={handleDisconnectSlack}
              discordEnabled={draftOrgNotif.discordEnabled}
              discordConnected={draftOrgNotif.discordConnected}
              discordWebhookUrl={discordWebhookUrl}
              discordWebhookError={discordWebhookError}
              onDiscordWebhookUrlChange={(value) => {
                setDiscordWebhookUrl(value);
                if (discordWebhookError) setDiscordWebhookError("");
              }}
              onDiscordEnabledChange={(value) =>
                setDraftOrgNotif((prev) => ({ ...prev, discordEnabled: value }))
              }
              onConnectDiscord={handleConnectDiscord}
              onDisconnectDiscord={handleDisconnectDiscord}
              workspaceName={currentWorkspaceName}
              clickAlarm={draftWorkspaceNotif.clickAlarm}
              weeklyReport={draftWorkspaceNotif.weeklyReport}
              onClickAlarmChange={(value) =>
                setDraftWorkspaceNotif((prev) => ({
                  ...prev,
                  clickAlarm: value,
                }))
              }
              onWeeklyReportChange={(value) =>
                setDraftWorkspaceNotif((prev) => ({
                  ...prev,
                  weeklyReport: value,
                }))
              }
              workspaceNotifiDisabled={workspaceNotifiDisabled}
              pendingOrgAction={pendingOrgAction}
            />
          </ErrorBoundary>
        )}
      </div>

      <div className="flex items-start justify-between gap-4 tablet:flex-col tablet:items-stretch">
        <button
          type="button"
          className="ml-3 font-caption text-text-muted underline decoration-surface-400 underline-offset-2 transition-colors hover:text-text-title tablet:ml-0 tablet:self-start"
          onClick={() => setIsWithdrawModalOpen(true)}
          aria-label="회원 탈퇴"
        >
          회원 탈퇴
        </button>
        <Button
          variant="primary"
          type="button"
          size="small"
          aria-label="개인 설정 변경사항 저장 버튼"
          onClick={handleSave}
          disabled={!hasChanges || isLoading || isNotificationSectionLoading}
          className="tablet:w-full"
        >
          {isSaving ? "저장 중..." : "저장"}
        </Button>
      </div>
      <WithdrawConfirmModal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        onConfirm={() => deleteMyAccountMutate(undefined)}
        isLoading={isWithdrawPending}
      />
    </section>
  );
}
