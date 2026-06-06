import { memo, type ReactNode } from "react";

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
  syncing: "동기화 중",
};

const CONNECTION_STATUS_BADGE: Record<
  TPlatformConnectionStatus,
  TBadgeVariant
> = {
  connected: "infoBlue",
  syncing: "infoYellow",
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
};

function PlatformConnectionMeta({
  status,
  syncedAt,
  externalAccountId,
  tokenExpireAt,
}: Pick<
  IPlatformConnectionItem,
  "status" | "syncedAt" | "externalAccountId" | "tokenExpireAt"
>) {
  const syncedLabel = formatConnectionDateTime(syncedAt);
  const expireLabel = formatConnectionDate(tokenExpireAt);
  const expireTone = getTokenExpireTone(tokenExpireAt);

  return (
    <div className="flex w-full flex-col gap-2">
      {status === "disconnected" ? (
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
          ) : null}
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
  tokenExpireAt,
  errorMessage,
  onConnect,
  onReconnect,
  onDisconnect,
}: TProps) {
  const label = PLATFORM_MAP[provider] ?? provider;

  return (
    <div className="flex h-full min-h-70 w-full flex-col gap-5 rounded-3xl bg-surface-100 p-8 shadow-Soft">
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
          {STATUS_LABEL[status]}
        </Badge>
      </div>

      <PlatformConnectionMeta
        status={status}
        syncedAt={syncedAt}
        externalAccountId={externalAccountId}
        tokenExpireAt={tokenExpireAt}
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
            광고 계정을 연동하면 대시보드와 캠페인에서 데이터를 확인할 수
            있습니다.
          </p>
        ) : null}

        <div className="flex w-full flex-wrap gap-4">
          {status === "disconnected" ? (
            <Button type="button" size="big" fullWidth onClick={onConnect}>
              연동하기
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
              >
                재연동
              </Button>
              <Button
                type="button"
                variant="dangerSoft"
                size="big"
                className="min-w-0 flex-1"
                onClick={onDisconnect}
              >
                연결 해제
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

          {status === "syncing" ? (
            <Button type="button" size="small" fullWidth disabled>
              동기화 중…
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default memo(PlatformIntegrationCard);
