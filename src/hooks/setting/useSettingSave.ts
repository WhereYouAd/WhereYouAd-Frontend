import { useRef, useState } from "react";
import { toast } from "sonner";

import type { IApiErrorResponse } from "@/types/common/common";

import type useSettingNotifications from "@/hooks/setting/useSettingNotifications";
import type useSettingPassword from "@/hooks/setting/useSettingPassword";
import type useSettingProfile from "@/hooks/setting/useSettingProfile";

import { updateMyInfo } from "@/api/auth/auth";

type TProfile = ReturnType<typeof useSettingProfile>;
type TPassword = ReturnType<typeof useSettingPassword>;
type TNotifications = ReturnType<typeof useSettingNotifications>;

interface IUseSettingSaveParams {
  profile: TProfile;
  password: TPassword;
  notifications: TNotifications;
}

export default function useSettingSave({
  profile,
  password,
  notifications,
}: IUseSettingSaveParams) {
  const [isSaving, setIsSaving] = useState(false);

  const isSavingRef = useRef(false);

  const hasAccountChanges =
    profile.hasProfileChanges || password.hasPasswordChanges;

  const hasChanges =
    hasAccountChanges ||
    (!notifications.isNotificationError &&
      notifications.hasNotificationChanges);

  const handleSave = async () => {
    if (isSavingRef.current) return;

    if (password.hasPasswordChanges) {
      if (!password.validatePassword()) return;
    } else {
      password.clearPasswordErrors();
    }

    isSavingRef.current = true;
    setIsSaving(true);

    let savedAccount = false;
    let savedAnyNotification = false;

    try {
      if (hasAccountChanges) {
        try {
          const res = await updateMyInfo({
            name: profile.draftProfile.name,
            oldPassword: password.currentPassword || undefined,
            newPassword: password.newPassword || undefined,
            isImageDeleted: profile.isImageDeleted,
            imageFile: profile.file,
          });
          profile.applyAccountSaveSuccess(res.data);
          password.clearPassword();
          savedAccount = true;
        } catch (e) {
          const error = e as IApiErrorResponse;
          toast.error(error.message ?? "회원정보수정에 실패했습니다");
          return;
        }
      }

      const canSaveNotification = !notifications.isNotificationError;

      const { selectedOrgId, isAdmin } = notifications;
      const shouldSaveChannel =
        canSaveNotification &&
        notifications.hasChannelChanges &&
        selectedOrgId != null;
      const shouldSaveAlerts =
        canSaveNotification &&
        notifications.hasWorkspaceNotifChanges &&
        selectedOrgId != null;

      const shouldSaveMaster =
        canSaveNotification &&
        notifications.hasMasterChanges &&
        selectedOrgId != null;
      const shouldSaveOrg =
        canSaveNotification &&
        notifications.hasOrgToggleChanges &&
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
            await notifications.updateChannels.mutateAsync({
              isBrowserPushEnabled: notifications.draftChannel.browserPush,
              isEmailEnabled: notifications.draftChannel.emailNotif,
            });
            notifications.setSavedChannel(notifications.draftChannel);
            savedSteps.push("알림 채널");
          }
          if (shouldSaveAlerts) {
            await notifications.updateAlerts.mutateAsync({
              alertClicks: notifications.draftWorkspaceNotif.clickAlarm,
              alertReport: notifications.draftWorkspaceNotif.weeklyReport,
            });
            notifications.setSavedWorkspaceNotif(
              notifications.draftWorkspaceNotif,
            );
            savedSteps.push("워크스페이스 알림");
          }
          if (shouldSaveMaster) {
            await notifications.updateMaster.mutateAsync({
              isMasterEnabled: notifications.draftOrgNotif.masterEnabled,
            });
            notifications.setSavedOrgNotif((prev) => ({
              ...prev,
              masterEnabled: notifications.draftOrgNotif.masterEnabled,
            }));
            savedSteps.push("마스터 알림");
          }
          if (shouldSaveOrg) {
            await notifications.updateOrg.mutateAsync(
              notifications.buildOrgBody({
                isSlackEnabled: notifications.draftOrgNotif.slackEnabled,
                slackWebhookUrl: "",
                disconnectSlack: false,
                isDiscordEnabled: notifications.draftOrgNotif.discordEnabled,
                discordWebhookUrl: "",
                disconnectDiscord: false,
              }),
            );
            notifications.setSavedOrgNotif((prev) => ({
              ...prev,
              slackEnabled: notifications.draftOrgNotif.slackEnabled,
              discordEnabled: notifications.draftOrgNotif.discordEnabled,
            }));
            savedSteps.push("슬랙/디스코드 설정");
          }
          savedAnyNotification = true;
        } catch (e) {
          const error = e as IApiErrorResponse;
          if (savedAccount) {
            toast.success("회원정보가 수정되었습니다");
          }
          const reason = error.message ?? "알림 저장에 실패했습니다.";
          toast.error(
            savedSteps.length > 0
              ? `${savedSteps.join(", ")}은(는) 저장됐지만, 이후 단계에서 실패했습니다: ${reason}`
              : reason,
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

  return {
    isSaving,
    hasChanges,
    handleSave,
  };
}
