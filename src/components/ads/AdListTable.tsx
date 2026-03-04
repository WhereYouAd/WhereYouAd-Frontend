import { useState } from "react";

import type { IAd } from "@/types/ads/campaign";

import AdRow from "./AdRow";

interface IAdsListTableProps {
  ads: IAd[];
}

export default function AdListTable({ ads }: IAdsListTableProps) {
  const [openAdId, setOpenAdId] = useState<number | null>(null);

  const handleToggle = (id: number) => {
    setOpenAdId((prev) => (prev === id ? null : id));
  };
  return (
    <div className="w-full flex flex-col mt-10 min-w-130">
      <h2 className="font-heading3 text-text-main mb-3">광고 모아보기</h2>
      <div className="border-t border-bg-disabled">
        {ads.length > 0 ? (
          ads.map((ad) => (
            <AdRow
              key={ad.id}
              name={ad.name}
              runStatus={ad.runStatus}
              runStatusText={ad.runStatusText}
              platform={ad.platform}
              isOpen={openAdId === ad.id}
              onToggle={() => handleToggle(ad.id)}
            />
          ))
        ) : (
          <div className="py-20 text-center text-text-placeholder font-body1">
            연결된 광고 소재가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
