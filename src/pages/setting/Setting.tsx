import { useState } from "react";

import { useDeleteMyAccount } from "@/hooks/auth/useDeleteMyAccount";
import useSettingNotification from "@/hooks/setting/useSettingNotification";
import useSettingPassWord from "@/hooks/setting/useSettingPassWord";
import useSettingProfile from "@/hooks/setting/useSettingProfile";
import useSettingSave from "@/hooks/setting/useSettingsave";

import Button from "@/components/common/button/Button";
import AreaErrorFallback from "@/components/common/error/AreaErrorFallback";
import { ErrorBoundary } from "@/components/common/error/ErrorBoundary";
import NotificationSection from "@/components/setting/NotificationSection";
import PasswordSection from "@/components/setting/PasswordSection";
import PasswordSectionSkeleton from "@/components/setting/PasswordSectionSkeleton";
import ProfileSection from "@/components/setting/ProfileSection";
import ProfileSectionSkeleton from "@/components/setting/ProfileSectionSkeleton";
import WithdrawConfirmModal from "@/components/setting/WithdrawConfirmModal";

export default function Setting() {
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  const profile = useSettingProfile();
  const password = useSettingPassWord();
  const notifications = useSettingNotification();
  const { isSaving, hasChanges, handleSave } = useSettingSave({
    profile,
    password,
    notifications,
  });
  const { mutate: deleteMyAccountMutate, isPending: isWithdrawPending } =
    useDeleteMyAccount();

  const {
    isLoading,
    draftProfile,
    setName,
    fileRef,
    preview,
    openFilePicker,
    handlePickFile,
    resetProfileImage,
  } = profile;

  const {
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmNewPassword,
    setConfirmNewPassword,
    passwordErrors,
  } = password;

  const {
    isAdmin,
    currentWorkspaceName,
    workspaceNotifiDisabled,
    isNotificationSectionLoading,
    isNotificationError,
    notificationError,
    refetchNotificationSettings,
    draftChannel,
    setDraftChannel,
    draftWorkspaceNotif,
    setDraftWorkspaceNotif,
    draftOrgNotif,
    setDraftOrgNotif,
    slackWebhookUrl,
    slackWebhookError,
    discordWebhookUrl,
    discordWebhookError,
    pendingOrgAction,
    setSlackWebhookUrl,
    setSlackWebhookError,
    setDiscordWebhookUrl,
    setDiscordWebhookError,
    handleMasterEnableChange,
    handleConnectSlack,
    handleDisconnectSlack,
    handleConnectDiscord,
    handleDisconnectDiscord,
  } = notifications;

  return (
    <section className="w-full flex flex-col gap-8">
      <div className="flex flex-col gap-6">
        {isLoading ? (
          <ProfileSectionSkeleton />
        ) : (
          <ProfileSection
            name={draftProfile.name}
            setName={setName}
            email={draftProfile.email}
            phoneNumber={draftProfile.phoneNumber}
            fileRef={fileRef}
            preview={preview}
            onPickFile={handlePickFile}
            openFilePicker={openFilePicker}
            resetImage={resetProfileImage}
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
              onMasterEnabledChange={handleMasterEnableChange}
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
