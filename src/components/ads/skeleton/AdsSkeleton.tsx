import { twMerge } from "tailwind-merge";

import {
  getAdListTableHeaderGridClass,
  getAdListTableRowGridClass,
} from "@/components/ads/AdRow";
import {
  CAMPAIGN_BUDGET_COL_CLASS,
  CAMPAIGN_PLATFORM_COL_CLASS,
} from "@/components/ads/CampaignRow";
import Card from "@/components/common/card/Card";
import {
  Skeleton,
  SkeletonCircle,
} from "@/components/common/skeleton/Skeleton";

const CAMPAIGN_TABLE_ROW_COUNT = 6;
const AD_TABLE_ROW_COUNT = 5;
const PLATFORM_DROPDOWN_COUNT = 3;

function CampaignTableRowSkeleton() {
  return (
    <li
      className="flex list-none items-center border-b border-surface-400/50 px-6 py-5 last:border-b-0 tablet:px-5 tablet:py-4 mobile:px-3 mobile:py-3"
      aria-hidden
    >
      <div className="flex w-11 shrink-0 items-center justify-center tablet:w-10 mobile:w-8">
        <Skeleton className="h-4 w-4 rounded" />
      </div>
      <div className="min-w-0 flex-1 pr-5 tablet:pr-4 mobile:pr-2">
        <Skeleton className="h-4 w-full max-w-48" />
      </div>
      <div
        className={twMerge(
          CAMPAIGN_PLATFORM_COL_CLASS,
          "flex items-center gap-1 mobile:gap-0.5",
        )}
      >
        <SkeletonCircle className="h-7 w-7 tablet:h-6 tablet:w-6 mobile:h-5 mobile:w-5" />
        <SkeletonCircle className="h-7 w-7 tablet:h-6 tablet:w-6 mobile:h-5 mobile:w-5" />
      </div>
      <div className={CAMPAIGN_BUDGET_COL_CLASS}>
        <Skeleton className="h-2 w-full rounded-full" />
      </div>
    </li>
  );
}

export function CampaignTableSkeleton() {
  return (
    <div
      className="flex min-h-0 w-full flex-1 flex-col overflow-hidden bg-surface-100"
      aria-hidden
    >
      <div className="flex shrink-0 items-center border-b border-surface-400/50 bg-surface-200/60 px-6 py-4 tablet:px-5 tablet:py-3.5 mobile:px-3 mobile:py-3">
        <div className="flex w-11 shrink-0 items-center justify-center tablet:w-10 mobile:w-8">
          <Skeleton className="h-4 w-4 rounded" />
        </div>
        <div className="min-w-0 flex-1">
          <Skeleton className="h-4 w-16" />
        </div>
        <div className={CAMPAIGN_PLATFORM_COL_CLASS} aria-hidden />
        <div className={CAMPAIGN_BUDGET_COL_CLASS}>
          <Skeleton className="h-4 w-24 mobile:w-16" />
        </div>
      </div>

      <ul className="m-0 list-none p-0">
        {Array.from({ length: CAMPAIGN_TABLE_ROW_COUNT }, (_, i) => (
          <CampaignTableRowSkeleton key={i} />
        ))}
      </ul>
    </div>
  );
}

export function AdsListPageSkeleton() {
  return (
    <section
      className="flex w-full flex-col"
      aria-busy="true"
      aria-label="캠페인 목록 로딩 중"
    >
      <Card className="flex flex-col overflow-hidden p-0">
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-surface-400/45 bg-surface-100 px-6 py-4 tablet:px-5 tablet:py-3.5 mobile:flex-col mobile:items-stretch mobile:px-3">
          <div className="flex min-w-0 flex-1 flex-col gap-2 mobile:flex-none">
            <Skeleton className="h-3 w-8" />
            <Skeleton className="h-6 w-28" />
          </div>
          <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 mobile:w-full mobile:flex-col mobile:items-stretch">
            <div className="flex items-center gap-2 mobile:w-full">
              <Skeleton className="h-9 w-14 rounded-xl mobile:min-w-0 mobile:flex-1" />
              <Skeleton className="h-9 w-14 rounded-xl mobile:min-w-0 mobile:flex-1" />
            </div>
            <Skeleton className="h-9 w-32 rounded-xl mobile:w-full" />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <CampaignTableSkeleton />
        </div>
      </Card>
    </section>
  );
}

export function CampaignDetailHeaderSkeleton() {
  return (
    <Card
      className="px-6 py-8 tablet:px-5 tablet:py-7 mobile:px-4 mobile:py-6"
      aria-hidden
    >
      <header className="flex w-full flex-col gap-6 mobile:gap-7">
        <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
          <div className="flex min-w-0 flex-wrap items-center gap-3">
            <Skeleton className="h-8 w-48 max-w-full" />
            <Skeleton className="h-6 w-14 rounded-full" />
          </div>
          <Skeleton className="h-4 w-24" />
        </div>

        <div className="min-w-0">
          <Skeleton className="mb-2 h-3 w-20" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-8 w-16 rounded-lg" />
            <Skeleton className="h-8 w-16 rounded-lg" />
          </div>
        </div>

        <div>
          <Skeleton className="mb-2 h-3 w-16" />
          <Skeleton className="mb-2 h-4 w-full max-w-xl" />
          <Skeleton className="h-4 w-full max-w-lg" />
        </div>
      </header>
    </Card>
  );
}

function AdListTableRowSkeleton({
  hidePlatformColumn = false,
}: {
  hidePlatformColumn?: boolean;
}) {
  return (
    <div className={getAdListTableRowGridClass(hidePlatformColumn)} aria-hidden>
      <div className="flex items-center justify-center">
        <Skeleton className="h-4 w-4 rounded" />
      </div>
      <Skeleton className="h-4 w-full max-w-52" />
      <div className="flex items-center justify-center">
        <Skeleton className="h-6 w-14 rounded-full" />
      </div>
      {!hidePlatformColumn ? <SkeletonCircle className="h-7 w-7" /> : null}
      <Skeleton className="ml-auto h-4 w-4 rounded" />
    </div>
  );
}

export function AdListTableSkeleton({
  hidePlatformColumn = false,
  embedded = false,
}: {
  hidePlatformColumn?: boolean;
  embedded?: boolean;
}) {
  return (
    <div
      className={twMerge(
        "flex min-h-0 min-w-0 flex-1 flex-col bg-surface-100",
        embedded
          ? "overflow-hidden rounded-lg border border-surface-400/50"
          : "overflow-x-auto overflow-y-auto rounded-xl border border-surface-400/40",
      )}
      aria-busy="true"
      aria-label="광고 목록 로딩 중"
    >
      <div
        className={`${getAdListTableHeaderGridClass(hidePlatformColumn)} shrink-0 border-b border-surface-400/50 bg-surface-200/60`}
        aria-hidden
      >
        <Skeleton className="mx-auto h-4 w-4 rounded" />
        <Skeleton className="h-4 w-12" />
        <div className="flex items-center justify-center">
          <Skeleton className="h-4 w-10" />
        </div>
        {!hidePlatformColumn ? <Skeleton className="h-4 w-12" /> : null}
        <span aria-hidden />
      </div>

      <div className="flex flex-col">
        {Array.from({ length: AD_TABLE_ROW_COUNT }, (_, i) => (
          <div
            key={i}
            className="border-b border-surface-400/50 last:border-b-0"
          >
            <AdListTableRowSkeleton hidePlatformColumn={hidePlatformColumn} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function CampaignDetailAdsSectionSkeleton() {
  return (
    <Card className="flex flex-col overflow-hidden p-0">
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-surface-400/75 bg-surface-100 px-6 py-4 tablet:px-5 tablet:py-3.5 mobile:flex-col mobile:items-stretch mobile:px-4">
        <div className="flex min-w-0 flex-1 flex-col gap-2 mobile:flex-none">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-6 w-28" />
        </div>
        <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 mobile:w-full">
          <Skeleton className="h-9 w-14 rounded-xl mobile:min-w-0 mobile:flex-1" />
          <Skeleton className="h-9 w-14 rounded-xl mobile:min-w-0 mobile:flex-1" />
        </div>
      </div>

      <div className="flex flex-col gap-6 px-6 py-6 tablet:px-5 tablet:py-5 mobile:gap-4 mobile:px-4 mobile:py-4">
        <div className="flex items-stretch gap-3">
          <span
            className="w-1 shrink-0 self-stretch rounded-r-md bg-surface-400"
            aria-hidden
          />
          <div className="flex flex-1 items-center gap-3">
            <SkeletonCircle className="h-10 w-10 shrink-0" />
            <Skeleton className="h-6 w-24" />
          </div>
        </div>
        <Skeleton className="h-28 w-full rounded-xl border border-surface-400/70" />
        <AdListTableSkeleton hidePlatformColumn embedded />
      </div>
    </Card>
  );
}

export function CampaignDetailPageSkeleton() {
  return (
    <section
      className="flex w-full flex-col gap-8"
      aria-busy="true"
      aria-label="캠페인 상세 로딩 중"
    >
      <CampaignDetailHeaderSkeleton />
      <CampaignDetailAdsSectionSkeleton />
    </section>
  );
}

function CampaignGroupDropdownItemSkeleton() {
  return (
    <div className="flex flex-col gap-3" aria-hidden>
      <div className="flex items-center gap-2 px-1">
        <SkeletonCircle className="h-6 w-6 shrink-0" />
        <Skeleton className="h-5 w-16" />
      </div>
      <Skeleton className="h-14 w-full rounded-2xl" />
    </div>
  );
}

export function CampaignGroupDropdownSkeleton() {
  return (
    <div
      className="flex flex-col gap-10"
      aria-busy="true"
      aria-label="플랫폼별 캠페인 목록 로딩 중"
    >
      {Array.from({ length: PLATFORM_DROPDOWN_COUNT }, (_, i) => (
        <CampaignGroupDropdownItemSkeleton key={i} />
      ))}
    </div>
  );
}

export default AdsListPageSkeleton;
