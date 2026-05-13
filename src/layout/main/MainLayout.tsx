import {
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

import { footerNav, mainNav } from "@/constants/sidebarNav";

import { isPathMatch, normalizePathname } from "@/utils/navigation/pathMatch";
import {
  applyWorkspacePathsToNav,
  navItemMatchesPath,
} from "@/utils/navigation/workspaceNavPaths";

import { useCoreQuery } from "@/hooks/customQuery";

import Sidebar from "@/components/sidebar/Sidebar";

import { getMyInfo } from "@/api/auth/auth";
import { getMyWorkspaces, getSavedWorkspace } from "@/api/workspace/org";
import useWorkspaceStore from "@/store/useWorkspaceStore";

export type TMainLayoutOutletContext = {
  setHeaderRight: Dispatch<SetStateAction<ReactNode | null>>;
  setCampaignDetailHeaderTitle: (title: string | null) => void;
};

export default function MainLayout() {
  useCoreQuery(["myInfo"], getMyInfo);
  const location = useLocation();
  const [headerRight, setHeaderRight] = useState<ReactNode | null>(null);
  const [campaignDetailHeaderTitle, setCampaignDetailHeaderTitle] = useState<
    string | null
  >(null);

  const setSelectedOrgId = useWorkspaceStore((s) => s.setSelectedOrgId);

  const savedWorkspaceQuery = useCoreQuery(
    ["savedWorkspace"],
    getSavedWorkspace,
  );
  const { data: savedData } = savedWorkspaceQuery;
  const { data: workspaces } = useCoreQuery(["my-workspaces"], getMyWorkspaces);
  const selectedOrgId = useWorkspaceStore((s) => s.selectedOrgId);

  const navForHeader = useMemo(
    () => [...applyWorkspacePathsToNav(mainNav, selectedOrgId), ...footerNav],
    [selectedOrgId],
  );

  useEffect(() => {
    if (!workspaces?.length || !savedWorkspaceQuery.isFetched) return;
    if (selectedOrgId !== null) return;

    const savedId = savedData?.orgId;
    const isExist = workspaces.some((w) => w.orgId === savedId);

    // 1. 현재 워크스페이스 조회 API 데이터
    if (savedId !== undefined && isExist) {
      setSelectedOrgId(savedId);
    }
    // 2. isCurrentWorkspace 또는 첫 번째
    else {
      const currentOrg = workspaces.find((w) => w.isCurrentWorkspace);
      setSelectedOrgId(currentOrg?.orgId || workspaces[0].orgId);
    }
  }, [
    workspaces,
    savedWorkspaceQuery.isFetched,
    savedData,
    setSelectedOrgId,
    selectedOrgId,
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
      <div className="flex h-full shrink-0">
        <Sidebar />
      </div>
      <main className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-y-auto">
        <header className="sticky top-0 z-30 shrink-0 border-b border-surface-300 bg-surface-100">
          <div className="flex h-14 items-center justify-between px-6 tablet:px-4">
            <div className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden">
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

            <div className="flex items-center gap-2">{headerRight}</div>
          </div>
        </header>
        <div className="mx-auto w-full max-w-400 min-w-0 px-8 py-6 tablet:px-6">
          <Outlet
            context={{
              setHeaderRight,
              setCampaignDetailHeaderTitle,
            }}
          />
        </div>
      </main>
    </div>
  );
}
