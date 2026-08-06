import { memo, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";

import { PLATFORM_MAP } from "@/types/dashboard/provider";
import type {
  IPlatformConnectionItem,
  TIntegrationProvider,
  TPlatformConnectionStatus,
} from "@/types/integration/platformConnection";

import {
  formatConnectionDate,
  formatConnectionDateTime,
  getTokenExpireTone,
} from "@/utils/integration/mapPlatformAccounts";

import Badge, { type TBadgeVariant } from "@/components/common/badge/Badge";
import Button from "@/components/common/button/Button";

import SyncIcon from "@/assets/icon/common/sync.svg?react";
import GoogleLogo from "@/assets/logo/social-logo/circle/google-circle.svg?react";
import MetaLogo from "@/assets/logo/social-logo/circle/meta-circle.svg?react";
import NaverLogo from "@/assets/logo/social-logo/circle/naver-circle.svg?react";

const PLATFORM_LOGOS: Record<TIntegrationProvider, ReactNode> = {
  GOOGLE: <GoogleLogo className="h-12 w-12" />,
  NAVER: <NaverLogo className="h-12 w-12" />,
  META: <MetaLogo className="h-12 w-12" />,
};

const STATUS_LABEL: Record<TPlatformConnectionStatus, string> = {
  disconnected: "미연동",
  connected: "연동됨",
  error: "연동 오류",
};

const CONNECTION_STATUS_BADGE: Record<
  TPlatformConnectionStatus,
  TBadgeVariant
> = {
  connected: "infoBlue",
  error: "infoRed",
  disconnected: "surface",
};

const TOKEN_EXPIRE_TEXT: Record<
  ReturnType<typeof getTokenExpireTone>,
  string
> = {
  default: "text-text-title",
  warning: "text-info-yellow",
  expired: "text-info-red/80",
};

type TProps = IPlatformConnectionItem & {
  onConnect?: () => void;
  onReconnect?: () => void;
  onDisconnect?: () => void;
  onSync?: () => void;
  isConnectLoading?: boolean;
  isSyncLoading?: boolean;
};

const SYNC_LINK_CLASS =
  "inline-flex shrink-0 items-center gap-1 font-body2 text-text-muted transition-colors hover:text-primary-400 disabled:cursor-wait disabled:opacity-50";

function PlatformConnectionMeta({
  status,
  syncedAt,
  externalAccountId,
  platformAccountId,
  tokenExpireAt,
  onSync,
  isSyncLoading = false,
}: Pick<
  IPlatformConnectionItem,
  | "status"
  | "syncedAt"
  | "externalAccountId"
  | "platformAccountId"
  | "tokenExpireAt"
> & {
  onSync?: () => void;
  isSyncLoading?: boolean;
}) {
  const syncedLabel = formatConnectionDateTime(syncedAt);
  const expireLabel = formatConnectionDate(tokenExpireAt);
  const expireTone = getTokenExpireTone(tokenExpireAt);
  const isSoftDisconnected =
    status === "disconnected" && platformAccountId != null;

  return (
    <div className="flex w-full flex-col gap-2">
      {isSoftDisconnected ? (
        <>
          {externalAccountId ? (
            <p className="min-w-0 font-body2 text-text-muted">
              <span>연동 계정 · </span>
              <span
                className="truncate text-text-title"
                title={externalAccountId}
              >
                {externalAccountId}
              </span>
            </p>
          ) : null}
          <p className="font-body2 text-text-muted">
            <span>토큰 만료 예정 · </span>
            {expireLabel ? (
              <span className={TOKEN_EXPIRE_TEXT[expireTone]}>
                {expireLabel}
              </span>
            ) : (
              <span className="text-text-muted/60">—</span>
            )}
          </p>
        </>
      ) : status === "disconnected" ? (
        <>
          <p className="font-body2 text-text-muted/60">
            <span>마지막 동기화 · </span>
            <span className="text-text-muted/60">—</span>
          </p>
          <p className="font-body2 text-text-muted/60">
            <span>연동 계정 · </span>
            <span className="text-text-muted/60">—</span>
          </p>
          <p className="font-body2 text-text-muted/60">
            <span>토큰 만료 예정 · </span>
            <span className="text-text-muted/60">—</span>
          </p>
        </>
      ) : status === "connected" ? (
        <>
          <div className="flex min-w-0 items-center justify-between gap-3">
            <p className="min-w-0 font-body2 text-text-muted">
              <span>마지막 동기화 · </span>
              <span className="text-text-title">{syncedLabel ?? "—"}</span>
            </p>
            {onSync ? (
              <button
                type="button"
                onClick={onSync}
                disabled={isSyncLoading}
                className={SYNC_LINK_CLASS}
              >
                <SyncIcon
                  className={twMerge(
                    "h-4 w-4 shrink-0",
                    isSyncLoading && "animate-spin",
                  )}
                  aria-hidden
                />
                {isSyncLoading ? "동기화 중..." : "동기화"}
              </button>
            ) : null}
          </div>

          {!syncedAt ? (
            <p className="font-body2 text-text-muted/80">
              아직 동기화된 데이터가 없습니다. 동기화를 진행해 주세요.
            </p>
          ) : null}

          {externalAccountId ? (
            <p className="min-w-0 font-body2 text-text-muted">
              <span>연동 계정 · </span>
              <span
                className="truncate text-text-title"
                title={externalAccountId}
              >
                {externalAccountId}
              </span>
            </p>
          ) : null}

          {expireLabel ? (
            <p className="font-body2 text-text-muted">
              <span>토큰 만료 예정 · </span>
              <span className={TOKEN_EXPIRE_TEXT[expireTone]}>
                {expireLabel}
              </span>
            </p>
          ) : (
            <p className="font-body2 text-text-muted">
              <span>토큰 만료 예정 · </span>
              <span className="text-text-muted/60">—</span>
            </p>
          )}
        </>
      ) : (
        <>
          {syncedLabel ? (
            <p className="font-body2 text-text-muted">
              <span>마지막 동기화 · </span>
              <span className="text-text-title">{syncedLabel}</span>
            </p>
          ) : null}

          {externalAccountId ? (
            <p className="min-w-0 font-body2 text-text-muted">
              <span>연동 계정 · </span>
              <span
                className="truncate text-text-title"
                title={externalAccountId}
              >
                {externalAccountId}
              </span>
            </p>
          ) : null}

          {expireLabel ? (
            <p className="font-body2 text-text-muted">
              <span>토큰 만료 예정 · </span>
              <span className={TOKEN_EXPIRE_TEXT[expireTone]}>
                {expireLabel}
              </span>
            </p>
          ) : (
            <p className="font-body2 text-text-muted">
              <span>토큰 만료 예정 · </span>
              <span className="text-text-muted/60">—</span>
            </p>
          )}
        </>
      )}
    </div>
  );
}

function PlatformIntegrationCard({
  provider,
  status,
  syncedAt,
  externalAccountId,
  platformAccountId,
  tokenExpireAt,
  errorMessage,
  onConnect,
  onReconnect,
  onDisconnect,
  onSync,
  isConnectLoading = false,
  isSyncLoading = false,
}: TProps) {
  const label = PLATFORM_MAP[provider] ?? provider;
  const statusLabel =
    status === "disconnected" && platformAccountId != null
      ? "연동 해제"
      : STATUS_LABEL[status];

  return (
    <div className="flex h-full min-h-70 w-full flex-col gap-5 rounded-3xl bg-surface-100 p-8 shadow-Soft mobile:p-6">
      <div className="flex min-w-0 items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="shrink-0">{PLATFORM_LOGOS[provider]}</div>
          <h3 className="min-w-0 truncate font-heading3 text-text-title">
            {label}
          </h3>
        </div>
        <Badge
          variant={CONNECTION_STATUS_BADGE[status]}
          className="h-8 shrink-0 font-body2"
        >
          {statusLabel}
        </Badge>
      </div>

      <PlatformConnectionMeta
        status={status}
        syncedAt={syncedAt}
        externalAccountId={externalAccountId}
        platformAccountId={platformAccountId}
        tokenExpireAt={tokenExpireAt}
        onSync={status === "connected" ? onSync : undefined}
        isSyncLoading={isSyncLoading}
      />

      {status === "error" && errorMessage ? (
        <p className="font-body2 text-info-red" role="alert">
          {errorMessage}
        </p>
      ) : null}

      <div className="flex-1" aria-hidden />

      <div className="mt-auto flex w-full flex-col gap-4">
        {status === "disconnected" ? (
          <p className="font-body2 text-text-muted/80">
            {platformAccountId != null ? (
              <>
                기존 계정을 다시 연동하면 대시보드와 캠페인에서 데이터를 확인할
                수 있습니다.
                <br />
                계정이 완전히 삭제되기 전까지는 기존 계정 복구가 가능하며,
                현재는 다른 계정 연동이 불가능합니다.
              </>
            ) : (
              <>
                광고 계정을 연동하면 대시보드와 캠페인에서 데이터를 확인할 수
                있습니다.
              </>
            )}
          </p>
        ) : null}

        <div className="flex w-full flex-wrap gap-4">
          {status === "disconnected" ? (
            <Button
              type="button"
              size="big"
              fullWidth
              onClick={onConnect}
              isLoading={isConnectLoading}
              disabled={isConnectLoading}
            >
              {isConnectLoading ? "연동 중..." : "연동하기"}
            </Button>
          ) : null}

          {status === "connected" ? (
            <>
              <Button
                type="button"
                variant="outline"
                size="big"
                className="min-w-0 flex-1"
                onClick={onReconnect}
                disabled={isSyncLoading}
              >
                재연동
              </Button>
              <Button
                type="button"
                variant="dangerSoft"
                size="big"
                className="min-w-0 flex-1"
                onClick={onDisconnect}
                disabled={isSyncLoading}
              >
                연동 해제
              </Button>
            </>
          ) : null}

          {status === "error" ? (
            <Button
              type="button"
              variant="outline"
              size="big"
              fullWidth
              onClick={onReconnect}
            >
              재연동
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default memo(PlatformIntegrationCard);
