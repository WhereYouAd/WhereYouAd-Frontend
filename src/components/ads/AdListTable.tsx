import { useEffect, useMemo, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

import type { IAd, TPlatform } from "@/types/ads/campaign";

import AdDetailContent from "./AdDetailContent";
import AdRow, { adListTableHeaderGridClass } from "./AdRow";

interface IAdsListTableProps {
  ads: IAd[];
  refetchAds: () => void;
  embedded?: boolean;
  selectedAdIds: ReadonlySet<number>;
  onToggleAd: (adId: number) => void;
  onToggleSelectAllVisible: () => void;
}

function normalizeProvider(raw: string | undefined): TPlatform | null {
  if (!raw) return null;
  const p = String(raw).trim().toLowerCase();
  if (p === "meta" || p === "google" || p === "naver") return p;
  return null;
}

function firstProviderRaw(ad: IAd): string | undefined {
  if (ad.providerType) return String(ad.providerType);
  const p = ad.provider;
  if (p == null) return undefined;
  if (Array.isArray(p)) return p[0] != null ? String(p[0]) : undefined;
  return String(p);
}

function providerToPlatform(ad: IAd): TPlatform {
  const fromPlatform = ad.platform ? normalizeProvider(ad.platform) : null;
  if (fromPlatform) return fromPlatform;
  const fromSource = normalizeProvider(firstProviderRaw(ad));
  if (fromSource) return fromSource;
  return "naver";
}

export default function AdListTable({
  ads,
  refetchAds,
  embedded = false,
  selectedAdIds,
  onToggleAd,
  onToggleSelectAllVisible,
}: IAdsListTableProps) {
  const [openAdId, setOpenAdId] = useState<number | null>(null);

  const operableAds = useMemo(
    () => ads.filter((a) => a.status !== "OVER"),
    [ads],
  );

  const operableIds = useMemo(
    () => operableAds.map((a) => a.id),
    [operableAds],
  );

  const allSelected =
    operableIds.length > 0 && operableIds.every((id) => selectedAdIds.has(id));
  const someSelected = operableIds.some((id) => selectedAdIds.has(id));

  const selectAllRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const el = selectAllRef.current;
    if (!el) return;
    el.indeterminate = someSelected && !allSelected;
  }, [allSelected, someSelected]);

  const handleToggle = (id: number) => {
    setOpenAdId((prev) => (prev === id ? null : id));
  };

  const titleBlock = (
    <div className="shrink-0 border-b border-surface-400/45 px-6 py-4 tablet:px-5 tablet:py-3.5">
      <p className="mb-1 font-caption text-text-placeholder">
        이 캠페인의 광고
      </p>
      <h2 className="font-heading3 text-text-title">광고 모아보기</h2>
    </div>
  );

  const listInner = (
    <div
      className={twMerge(
        "flex min-h-0 min-w-0 flex-1 flex-col overflow-x-auto overflow-y-auto bg-surface-100",
        !embedded && "rounded-xl border border-surface-400/40",
      )}
    >
      <div
        className={`${adListTableHeaderGridClass} shrink-0 border-b border-surface-400/50 bg-surface-200/60`}
      >
        <div
          className="flex items-center justify-center"
          role="presentation"
          onClick={(e) => e.stopPropagation()}
        >
          <input
            ref={selectAllRef}
            type="checkbox"
            className="checkbox"
            checked={allSelected}
            onChange={onToggleSelectAllVisible}
            disabled={operableIds.length === 0}
            aria-label="표시 중인 광고 전체 선택"
          />
        </div>
        <div className="min-w-0 justify-self-start self-center font-label text-text-muted">
          광고 명
        </div>
        <div className="flex min-w-0 items-center justify-start justify-self-start self-center pr-8 font-label text-text-muted tablet:pr-6">
          상태
        </div>
        <div className="flex min-w-[2.75rem] items-center justify-start justify-self-start self-center font-label text-text-muted">
          플랫폼
        </div>
        <div className="text-right font-label text-text-muted" aria-hidden>
          &nbsp;
        </div>
      </div>

      {ads.length > 0 ? (
        ads.map((ad) => {
          const platform = providerToPlatform(ad);

          const isRunning = ad.status === "ON_GOING";
          const isPaused = ad.status === "PAUSED";

          const runStatus = isRunning ? "running" : "stopped";
          const runStatusText = isRunning
            ? "운영 중"
            : isPaused
              ? "중단"
              : "종료";

          const isOpen = openAdId === ad.id;
          const selectable = ad.status !== "OVER";

          return (
            <div key={ad.id} className="flex flex-col">
              <AdRow
                name={ad.name}
                adStatus={ad.status}
                runStatus={runStatus}
                runStatusText={runStatusText}
                platform={platform}
                isOpen={isOpen}
                isSelected={selectedAdIds.has(ad.id)}
                selectable={selectable}
                onToggleSelect={() => onToggleAd(ad.id)}
                onToggle={() => handleToggle(ad.id)}
              />

              {isOpen ? (
                <div className="w-full min-w-0 origin-top border-b-2 border-surface-400 bg-surface-300">
                  <AdDetailContent ad={ad} refetchAds={refetchAds} />
                </div>
              ) : null}
            </div>
          );
        })
      ) : (
        <div className="py-16 text-center font-body1 text-text-placeholder">
          연결된 광고 소재가 없습니다.
        </div>
      )}
    </div>
  );

  if (embedded) {
    return (
      <div className="flex min-h-0 w-full flex-1 flex-col">{listInner}</div>
    );
  }

  return (
    <div className="flex w-full flex-col border-b border-surface-400">
      {titleBlock}
      <div className="mt-4">{listInner}</div>
    </div>
  );
}
