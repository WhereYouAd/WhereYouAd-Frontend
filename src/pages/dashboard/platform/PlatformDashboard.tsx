import { type ReactNode, useCallback, useEffect, useMemo } from "react";
import {
  useLocation,
  useNavigate,
  useOutletContext,
  useSearchParams,
} from "react-router-dom";

import type { TProviderType } from "@/types/dashboard/overview";
import { PLATFORM_MAP, PROVIDER_TYPES } from "@/types/dashboard/provider";
import type { IPlatformConnectionItem } from "@/types/integration/platformConnection";

import { isTokenExpired } from "@/utils/integration/mapPlatformAccounts";

import { usePlatformConnections } from "@/hooks/integration/usePlatformConnections";

import AllPlatformView from "@/components/dashboard/platform/AllPlatformView";
import PlatformViewSwitcher from "@/components/dashboard/platform/PlatformViewSwitcher";
import SinglePlatformView from "@/components/dashboard/platform/SinglePlatformView";

type TPlatformView = "전체" | TProviderType;

type TDashboardHeaderContext = {
  setHeaderRight?: (node: ReactNode | null) => void;
};

function parseProviderParam(value: string | null): TPlatformView {
  if (value != null && (PROVIDER_TYPES as readonly string[]).includes(value)) {
    return value as TProviderType;
  }
  return "전체";
}

/** 드롭다운·개별 뷰: connected 이고 토큰 미만료일 때만 */
function isUsableConnectedPlatform(connection: IPlatformConnectionItem) {
  if (connection.status !== "connected") return false;
  if (isTokenExpired(connection.tokenExpireAt)) return false;
  return true;
}

export default function PlatformDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { setHeaderRight } = useOutletContext<TDashboardHeaderContext>();

  const providerFromUrl = parseProviderParam(searchParams.get("provider"));

  const { data: connections } = usePlatformConnections();
  /** 성공으로 목록이 온 뒤에만 URL provider 검증 (isFetched는 실패도 true) */
  const hasConnectionData = connections !== undefined;

  const connectedProviders = useMemo(() => {
    const connected = new Set(
      (connections ?? [])
        .filter(isUsableConnectedPlatform)
        .map((c) => c.provider),
    );
    return PROVIDER_TYPES.filter((provider) => connected.has(provider));
  }, [connections]);

  /**
   * 연결 목록 성공 후 URL provider가 사용 불가면 화면은 전체보기.
   * (주소 정리는 navigate로 별도 처리 — setSearchParams delete만으로는 안 지워지는 경우 대비)
   */
  const selectedPlatform: TPlatformView = !hasConnectionData
    ? providerFromUrl
    : providerFromUrl !== "전체" && connectedProviders.includes(providerFromUrl)
      ? providerFromUrl
      : "전체";

  const isAllView = selectedPlatform === "전체";

  const clearProviderQuery = useCallback(() => {
    if (!searchParams.has("provider")) return;

    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("provider");
    const search = nextParams.toString();

    navigate(
      {
        pathname: location.pathname,
        search: search ? `?${search}` : "",
      },
      { replace: true },
    );
  }, [searchParams, navigate, location.pathname]);

  const setSelectedPlatform = useCallback(
    (next: TPlatformView) => {
      if (next === "전체") {
        clearProviderQuery();
        return;
      }

      setSearchParams(
        (prev) => {
          const nextParams = new URLSearchParams(prev);
          nextParams.set("provider", next);
          return nextParams;
        },
        { replace: true },
      );
    },
    [clearProviderQuery, setSearchParams],
  );

  const isPlatformSelectDisabled = connectedProviders.length === 0;

  const platformItems = useMemo(
    () =>
      connectedProviders.map((value) => ({
        label: PLATFORM_MAP[value],
        onClick: () => setSelectedPlatform(value),
      })),
    [connectedProviders, setSelectedPlatform],
  );

  useEffect(() => {
    if (!hasConnectionData) return;
    if (!searchParams.has("provider")) return;

    const parsed = parseProviderParam(searchParams.get("provider"));
    if (parsed !== "전체" && connectedProviders.includes(parsed)) return;

    clearProviderQuery();
  }, [hasConnectionData, searchParams, connectedProviders, clearProviderQuery]);

  const selectedPlatformLabel =
    selectedPlatform === "전체"
      ? "플랫폼 선택"
      : PLATFORM_MAP[selectedPlatform];

  useEffect(() => {
    if (!setHeaderRight) return;

    setHeaderRight(
      <PlatformViewSwitcher
        isAllView={isAllView}
        selectedPlatformLabel={selectedPlatformLabel}
        platformItems={platformItems}
        onSelectAll={() => setSelectedPlatform("전체")}
        isPlatformSelectDisabled={isPlatformSelectDisabled}
        className="mobile:hidden"
      />,
    );

    return () => setHeaderRight(null);
  }, [
    isAllView,
    platformItems,
    selectedPlatformLabel,
    setHeaderRight,
    isPlatformSelectDisabled,
    setSelectedPlatform,
  ]);

  return (
    <section className="flex w-full min-w-0 flex-col gap-8">
      <PlatformViewSwitcher
        isAllView={isAllView}
        selectedPlatformLabel={selectedPlatformLabel}
        platformItems={platformItems}
        onSelectAll={() => setSelectedPlatform("전체")}
        isPlatformSelectDisabled={isPlatformSelectDisabled}
        layout="mobile"
      />
      {isAllView ? (
        <AllPlatformView />
      ) : (
        <SinglePlatformView platform={selectedPlatform} />
      )}
    </section>
  );
}
