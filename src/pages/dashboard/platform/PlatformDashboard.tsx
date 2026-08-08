import { type ReactNode, useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";

import type { TProviderType } from "@/types/dashboard/overview";
import { PLATFORM_MAP, PROVIDER_TYPES } from "@/types/dashboard/provider";

import { usePlatformConnections } from "@/hooks/integration/usePlatformConnections";

import AllPlatformView from "@/components/dashboard/platform/AllPlatformView";
import PlatformViewSwitcher from "@/components/dashboard/platform/PlatformViewSwitcher";
import SinglePlatformView from "@/components/dashboard/platform/SinglePlatformView";

type TPlatformView = "전체" | TProviderType;

type TDashboardHeaderContext = {
  setHeaderRight?: (node: ReactNode | null) => void;
};

export default function PlatformDashboard() {
  const [selectedPlatform, setSelectedPlatform] =
    useState<TPlatformView>("전체");
  const { setHeaderRight } = useOutletContext<TDashboardHeaderContext>();

  const isAllView = selectedPlatform === "전체";

  const { data: connections } = usePlatformConnections();
  const connectedProviders = useMemo(() => {
    const connected = new Set(
      (connections ?? [])
        .filter((c) => c.status === "connected")
        .map((c) => c.provider),
    );
    return PROVIDER_TYPES.filter((provider) => connected.has(provider));
  }, [connections]);

  const isPlatformSelectDisabled = connectedProviders.length === 0;

  const platformItems = useMemo(
    () =>
      connectedProviders.map((value) => ({
        label: PLATFORM_MAP[value],
        onClick: () => setSelectedPlatform(value),
      })),
    [connectedProviders],
  );

  useEffect(() => {
    if (selectedPlatform === "전체") return;
    if (!connectedProviders.includes(selectedPlatform)) {
      setSelectedPlatform("전체");
    }
  }, [connectedProviders, selectedPlatform]);

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
