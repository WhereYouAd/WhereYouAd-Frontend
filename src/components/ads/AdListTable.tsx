import { useState } from "react";

import type { IAd, TPlatform } from "@/types/ads/campaign";

import AdDetailContent from "./AdDetailContent";
import AdRow from "./AdRow";

interface IAdsListTableProps {
  ads: IAd[];
  refetchAds: () => void;
}

export default function AdListTable({ ads, refetchAds }: IAdsListTableProps) {
  const [openAdId, setOpenAdId] = useState<number | null>(null);

  const handleToggle = (id: number) => {
    setOpenAdId((prev) => (prev === id ? null : id));
  };
  return (
    <div className="w-full flex flex-col mt-10 border-b border-bg-disabled">
      <h2 className="font-heading3 text-text-main mb-3">광고 모아보기</h2>
      <div>
        {ads && ads.length > 0 ? (
          ads.map((ad) => {
            const platform = String(ad.provider).toLowerCase() as TPlatform;

            const isRunning = ad.status === "ON_GOING";
            const isPaused = ad.status === "PAUSED";

            const runStatus = isRunning ? "running" : "stopped";
            const runStatusText = isRunning
              ? "운영 중"
              : isPaused
                ? "중단"
                : "종료";

            return (
              <div key={ad.id} className="flex flex-col">
                <AdRow
                  name={ad.name}
                  runStatus={runStatus}
                  runStatusText={runStatusText}
                  platform={platform}
                  isOpen={openAdId === ad.id}
                  onToggle={() => handleToggle(ad.id)}
                />

                {openAdId === ad.id && (
                  <div className="w-full origin-top">
                    <AdDetailContent ad={ad} refetchAds={refetchAds} />
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="py-20 text-center text-text-placeholder font-body1">
            연결된 광고 소재가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
