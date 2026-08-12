import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import type { IApiErrorResponse } from "@/types/common/common";
import type { IUpdateOrgNotificationSettingsRequest } from "@/types/setting/notification";
import {
  DEFAULT_CHANNEL,
  DEFAULT_ORG_NOTIF,
  DEFAULT_WORKSPACE_NOTIF,
  type IChannelNotificationSettings,
  type IOrgNotificationSettings,
  type IWorkspaceNotificationSettings,
} from "@/types/setting/settingPage";

import { useCoreQuery } from "@/hooks/customQuery";
import { useMyNotificationSettings } from "@/hooks/setting/useMyNotificationSettings";
import { useUpdateAlertsNotificationSettings } from "@/hooks/setting/useUpdateAlertsNotificationSettings";
import { useUpdateChannelNotificationSettings } from "@/hooks/setting/useUpdateChannelNotificationSettings";
import { useUpdateMasterNotificationSettings } from "@/hooks/setting/useUpdateMasterNotificationSetting";
import { useUpdateOrgNotificationSettings } from "@/hooks/setting/useUpdateOrgNotificationSettings";

import { getMyWorkspaces } from "@/api/workspace/org";
import { QUERY_KEYS } from "@/lib/queryKeys";
import useWorkspaceStore from "@/store/useWorkspaceStore";

export default function useSettingNotifications() {
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

  const selectedOrgId = useWorkspaceStore((s) => s.selectedOrgId);

  const myRole = useWorkspaceStore((s) => s.myRole);
  const isAdmin = myRole === "ADMIN";

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

  const updateChannels = useUpdateChannelNotificationSettings();
  const updateAlerts = useUpdateAlertsNotificationSettings();
  const updateOrg = useUpdateOrgNotificationSettings();
  const updateMaster = useUpdateMasterNotificationSettings();

  const currentWorkspaceName = useMemo(() => {
    if (selectedOrgId === null) return null;
    return workspaces?.find((w) => w.orgId === selectedOrgId)?.name ?? null;
  }, [selectedOrgId, workspaces]);

  const workspaceNotifiDisabled =
    selectedOrgId == null || (!isWorkspacesLoading && !currentWorkspaceName);

  const isNotificationSectionLoading =
    selectedOrgId !== null &&
    (isNotificationLoading || isNotificationRefetching);

  const buildOrgBody = (
    overrides: Partial<IUpdateOrgNotificationSettingsRequest> = {},
  ): IUpdateOrgNotificationSettingsRequest => ({
    isSlackEnabled: savedOrgNotif.slackEnabled,
    slackWebhookUrl: "",
    disconnectSlack: false,
    isDiscordEnabled: savedOrgNotif.discordEnabled,
    discordWebhookUrl: "",
    disconnectDiscord: false,
    alertClicks: savedWorkspaceNotif.clickAlarm ?? false,
    alertReport: savedWorkspaceNotif.weeklyReport ?? false,
    ...overrides,
  });

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

  const handleMasterEnableChange = (value: boolean) => {
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
      slackEnabled: prev.slackConnected && savedOrgNotif.slackEnabled,
      discordEnabled: prev.discordConnected && savedOrgNotif.discordEnabled,
    }));
    setDraftChannel(savedChannel);
    setDraftWorkspaceNotif(savedWorkspaceNotif);
  };

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

  const hasNotificationChanges =
    hasChannelChanges ||
    hasWorkspaceNotifChanges ||
    hasMasterChanges ||
    hasOrgToggleChanges;

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

  return {
    isAdmin,
    selectedOrgId,
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
    savedChannel,
    savedWorkspaceNotif,
    savedOrgNotif,
    setSavedChannel,
    setSavedWorkspaceNotif,
    setSavedOrgNotif,

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

    hasChannelChanges,
    hasWorkspaceNotifChanges,
    hasMasterChanges,
    hasOrgToggleChanges,
    hasNotificationChanges,

    updateChannels,
    updateAlerts,
    updateOrg,
    updateMaster,
    buildOrgBody,
  };
}
