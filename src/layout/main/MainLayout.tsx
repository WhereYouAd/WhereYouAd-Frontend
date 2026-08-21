import {
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { twMerge } from "tailwind-merge";

import { footerNav, mainNav } from "@/constants/sidebarNav";

import { isPathMatch, normalizePathname } from "@/utils/navigation/pathMatch";
import {
  applyWorkspacePathsToNav,
  navItemMatchesPath,
} from "@/utils/navigation/workspaceNavPaths";

import { ONBOARDING_KEY } from "@/hooks/common/useOnboardingTour";
import { useCoreQuery } from "@/hooks/customQuery";

import OnboardingTour from "@/components/common/OnboardingTour";
import NotificationBell from "@/components/notification/NotificationBell";
import Sidebar from "@/components/sidebar/Sidebar";

import { getMyInfo } from "@/api/auth/auth";
import { getMyWorkspaces, getSavedWorkspace } from "@/api/workspace/org";
import MenuIcon from "@/assets/icon/sidebar/menu.svg?react";
import { QUERY_KEYS } from "@/lib/queryKeys";
import useSidebarStore from "@/store/useSidebarStore";
import useWorkspaceStore from "@/store/useWorkspaceStore";

export type TMainLayoutOutletContext = {
  setHeaderRight: Dispatch<SetStateAction<ReactNode | null>>;
  setCampaignDetailHeaderTitle: (title: string | null) => void;
};

export default function MainLayout() {
  useCoreQuery(QUERY_KEYS.auth.myInfo(), getMyInfo);
  const location = useLocation();
  const [headerRight, setHeaderRight] = useState<ReactNode | null>(null);
  const [campaignDetailHeaderTitle, setCampaignDetailHeaderTitle] = useState<
    string | null
  >(null);

  const setSelectedOrgId = useWorkspaceStore((s) => s.setSelectedOrgId);
  const setMyRole = useWorkspaceStore((s) => s.setMyRole);
  const resetWorkspace = useWorkspaceStore((s) => s.reset);
  const myRole = useWorkspaceStore((s) => s.myRole);

  const savedWorkspaceQuery = useCoreQuery(
    QUERY_KEYS.workspace.saved(),
    getSavedWorkspace,
  );
  const { data: savedData } = savedWorkspaceQuery;
  const { data: workspaces } = useCoreQuery(
    QUERY_KEYS.workspace.list(),
    getMyWorkspaces,
  );
  const selectedOrgId = useWorkspaceStore((s) => s.selectedOrgId);
  const isMobileOpen = useSidebarStore((s) => s.isMobileOpen);
  const setIsMobileOpen = useSidebarStore((s) => s.setIsMobileOpen);
  const closeMobile = useSidebarStore((s) => s.closeMobile);

  const navForHeader = useMemo(
    () => [...applyWorkspacePathsToNav(mainNav, selectedOrgId), ...footerNav],
    [selectedOrgId],
  );

  useEffect(() => {
    // undefined: 로딩 중 / []: 워크스페이스 없음(유효한 결과)
    if (!workspaces || !savedWorkspaceQuery.isFetched) return;

    if (workspaces.length === 0) {
      if (selectedOrgId !== null || myRole !== null) {
        resetWorkspace();
      }
      return;
    }

    // 현재 유저 목록에 있는 orgId만 유지 (+ role 동기화)
    // 목록에 없으면 return하지 않고 아래 saved/current 초기화로 계속
    if (selectedOrgId !== null) {
      const workspace = workspaces.find((w) => w.orgId === selectedOrgId);
      if (workspace) {
        if (myRole !== workspace.myRole) {
          setMyRole(workspace.myRole);
        }
        return;
      }
    }

    const savedId = savedData?.orgId;
    const isExist = workspaces.some((w) => w.orgId === savedId);

    // 1. 저장된 워크스페이스가 현재 유저 목록에 있으면 선택
    if (savedId !== undefined && isExist) {
      const workspace = workspaces.find((w) => w.orgId === savedId);
      setSelectedOrgId(savedId);
      if (workspace) setMyRole(workspace.myRole);
    }
    // 2. isCurrentWorkspace 또는 첫 번째
    else {
      const currentOrg =
        workspaces.find((w) => w.isCurrentWorkspace) ?? workspaces[0];
      setSelectedOrgId(currentOrg.orgId);
      setMyRole(currentOrg.myRole);
    }
  }, [
    workspaces,
    savedWorkspaceQuery.isFetched,
    savedData,
    setSelectedOrgId,
    setMyRole,
    resetWorkspace,
    selectedOrgId,
    myRole,
  ]);

  const pathname = normalizePathname(location.pathname);

  const isAdsCampaignDetailPath = useMemo(
    () => /^\/ads\/[^/]+\/[^/]+$/.test(pathname),
    [pathname],
  );

  useEffect(() => {
    if (!isAdsCampaignDetailPath) {
      setCampaignDetailHeaderTitle(null);
    }
  }, [isAdsCampaignDetailPath]);

  useEffect(() => {
    closeMobile();
  }, [location.pathname, closeMobile]);

  useEffect(() => {
    if (!isMobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMobile();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isMobileOpen, closeMobile]);

  useEffect(() => {
    if (!isMobileOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  const { parentLabel, currentLabel, parentTo, currentTo } = useMemo(() => {
    const path = pathname;
    if (/^\/ads\/[^/]+\/[^/]+$/.test(path)) {
      return {
        parentLabel: "",
        currentLabel: "",
        parentTo: null as string | null,
        currentTo: null as string | null,
      };
    }

    for (const parent of navForHeader) {
      const children = parent.children ?? [];
      const matchedChild = children.find((c) => navItemMatchesPath(c, path));
      if (matchedChild) {
        return {
          parentLabel: parent.label,
          currentLabel: matchedChild.label,
          parentTo: parent.path ?? null,
          currentTo: matchedChild.path ?? null,
        };
      }

      if (parent.path && isPathMatch(path, parent.path)) {
        return {
          parentLabel: parent.label,
          currentLabel: parent.label,
          parentTo: parent.path,
          currentTo: parent.path,
        };
      }
    }

    return {
      parentLabel: "",
      currentLabel: "",
      parentTo: null,
      currentTo: null,
    };
  }, [pathname, navForHeader]);

  const crumbLinkBody =
    "truncate font-body1 text-text-body no-underline transition-colors hover:text-primary-400 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40";
  const crumbLinkTitle =
    "truncate font-heading4 text-text-title no-underline transition-colors hover:text-primary-400 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40";

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-surface-200">
      {(myRole !== null ||
        (workspaces !== undefined && workspaces.length === 0)) && (
        <OnboardingTour autoStart={!localStorage.getItem(ONBOARDING_KEY)} />
      )}
      <div
        className={twMerge(
          "flex h-full shrink-0",
          "tablet:fixed tablet:inset-y-0 tablet:left-0 tablet:z-50",
          "tablet:transition-transform tablet:duration-300 tablet:ease-out",
          isMobileOpen ? "tablet:translate-x-0" : "tablet:-translate-x-full",
        )}
      >
        <Sidebar />
      </div>
      {isMobileOpen ? (
        <button
          type="button"
          aria-label="메뉴 닫기"
          className="fixed inset-0 z-40 hidden bg-text-title/40 tablet:block"
          onClick={closeMobile}
        />
      ) : null}
      <main className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-y-auto scroll-pt-14">
        <header className="sticky top-0 z-30 shrink-0 border-b border-surface-300 bg-surface-100">
          <div className="flex h-14 items-center justify-between gap-2 px-6 tablet:px-4">
            <div className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden">
              <button
                type="button"
                aria-label="메뉴 열기"
                aria-expanded={isMobileOpen}
                className="hidden shrink-0 rounded-xl p-2 text-text-body hover:bg-surface-200 tablet:flex"
                onClick={() => setIsMobileOpen(true)}
              >
                <MenuIcon className="h-6 w-6" />
              </button>
              {isAdsCampaignDetailPath ? (
                <>
                  <Link to="/ads" className={`shrink-0 ${crumbLinkBody}`}>
                    캠페인
                  </Link>
                  <span className="shrink-0 text-text-placeholder" aria-hidden>
                    /
                  </span>
                  <Link to="/ads" className={`shrink-0 ${crumbLinkBody}`}>
                    캠페인 목록
                  </Link>
                  <span className="shrink-0 text-text-placeholder" aria-hidden>
                    /
                  </span>
                  <span className="min-w-0 flex-1 truncate font-heading4 text-text-title">
                    {campaignDetailHeaderTitle ?? "\u2026"}
                  </span>
                </>
              ) : (
                <>
                  {parentLabel ? (
                    <>
                      {parentTo ? (
                        <Link to={parentTo} className={crumbLinkBody}>
                          {parentLabel}
                        </Link>
                      ) : (
                        <span className="truncate font-body1 text-text-body">
                          {parentLabel}
                        </span>
                      )}
                      <span
                        className="text-text-placeholder"
                        aria-hidden="true"
                      >
                        /
                      </span>
                    </>
                  ) : null}
                  {currentTo ? (
                    <Link to={currentTo} className={crumbLinkTitle}>
                      {currentLabel || parentLabel || " "}
                    </Link>
                  ) : (
                    <span className="truncate font-heading4 text-text-title">
                      {currentLabel || parentLabel || " "}
                    </span>
                  )}
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              {headerRight}
              <NotificationBell />
            </div>
          </div>
        </header>
        <div className="w-full min-w-0 px-8 py-6 tablet:px-6">
          <div className="w-full max-w-400 min-w-0">
            <Outlet
              context={{
                setHeaderRight,
                setCampaignDetailHeaderTitle,
              }}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
