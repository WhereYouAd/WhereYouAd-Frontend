import { useEffect, useMemo, useRef } from "react";
import { twMerge } from "tailwind-merge";

import type { ICampaign } from "@/types/ads/campaign";

import CampaignRow from "./CampaignRow";

interface ICampaignTableProps {
  campaigns: ICampaign[];
  onRowClick?: (id: number) => void;
  selectedProjectIds: ReadonlySet<number>;
  onToggleProject: (projectId: number) => void;
  onToggleSelectAllVisible: () => void;
  embedded?: boolean;
}

export default function CampaignTable({
  campaigns,
  onRowClick,
  selectedProjectIds,
  onToggleProject,
  onToggleSelectAllVisible,
  embedded = false,
}: ICampaignTableProps) {
  const visibleCampaigns = useMemo(
    () => campaigns.filter((project) => project.status !== "OVER"),
    [campaigns],
  );

  const visibleIds = useMemo(
    () => visibleCampaigns.map((c) => c.projectId),
    [visibleCampaigns],
  );

  const allSelected =
    visibleIds.length > 0 &&
    visibleIds.every((id) => selectedProjectIds.has(id));
  const someSelected = visibleIds.some((id) => selectedProjectIds.has(id));

  const selectAllRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const el = selectAllRef.current;
    if (!el) return;
    el.indeterminate = someSelected && !allSelected;
  }, [allSelected, someSelected]);

  return (
    <div
      className={twMerge(
        "w-full overflow-hidden bg-surface-100",
        embedded
          ? "flex min-h-0 flex-1 flex-col rounded-none border-0"
          : "rounded-xl border border-surface-400/40",
      )}
    >
      <div className="flex shrink-0 items-center border-b border-surface-400/50 bg-surface-200/60 px-6 py-4 tablet:px-5 tablet:py-3.5">
        <div
          className="flex w-11 shrink-0 items-center justify-center tablet:w-10"
          role="presentation"
          onClick={(e) => e.stopPropagation()}
        >
          <input
            ref={selectAllRef}
            type="checkbox"
            className="checkbox"
            checked={allSelected}
            onChange={onToggleSelectAllVisible}
            aria-label="표시 중인 캠페인 전체 선택"
          />
        </div>
        <div className="min-w-0 flex-1 font-label text-text-muted">
          캠페인 명
        </div>
        <div className="w-28 shrink-0 text-left font-label text-text-muted whitespace-nowrap mr-24 tablet:w-24 tablet:mr-20">
          플랫폼
        </div>
        <div className="w-[28%] shrink-0 text-left font-label text-text-muted tablet:w-[26%]">
          <span className="tablet:hidden">예산 소진 현황</span>
          <span className="hidden tablet:inline">예산</span>
        </div>
      </div>

      <ul className="m-0 list-none p-0">
        {visibleCampaigns.length > 0 ? (
          visibleCampaigns.map((project) => (
            <CampaignRow
              key={project.projectId}
              {...project}
              isSelected={selectedProjectIds.has(project.projectId)}
              onToggleSelect={() => onToggleProject(project.projectId)}
              onClick={() => onRowClick?.(project.projectId)}
            />
          ))
        ) : (
          <li className="py-16 text-center font-body2 text-text-placeholder">
            현재 표시할 캠페인이 없습니다.
          </li>
        )}
      </ul>
    </div>
  );
}
