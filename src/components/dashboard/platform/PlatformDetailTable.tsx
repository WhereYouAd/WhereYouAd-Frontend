import { useMemo } from "react";

import type { IPlatformDailyPerformance } from "@/pages/dashboard/platform/platformDashboard.mock";

interface IPlatformDetailTableProps {
  data: IPlatformDailyPerformance[];
}

function PlatformDetailTable({ data }: IPlatformDetailTableProps) {
  // 합계 계산
  const total = useMemo(() => {
    if (!data.length) return null;
    const count = data.length;
    return {
      spend: data.reduce((acc, curr) => acc + curr.spend, 0),
      impressions: data.reduce((acc, curr) => acc + curr.impressions, 0),
      clicks: data.reduce((acc, curr) => acc + curr.clicks, 0),
      ctr: data.reduce((acc, curr) => acc + curr.ctr, 0) / count,
      cpc: data.reduce((acc, curr) => acc + curr.cpc, 0) / count,
      conversions: data.reduce((acc, curr) => acc + curr.conversions, 0),
      roas: data.reduce((acc, curr) => acc + curr.roas, 0) / count,
    };
  }, [data]);

  return (
    <div className="mt-4 flex flex-col">
      <style>{`
        .custom-scrollbar {
          scrollbar-gutter: stable;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #D1D1D1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #B1B1B1;
        }
      `}</style>

      <div className="overflow-auto max-h-125 relative custom-scrollbar border-t border-bg-disabled">
        <table className="w-full text-left border-separate border-spacing-0 min-w-[800px] table-fixed">
          <thead className="sticky top-0 z-20 bg-white">
            <tr className="text-text-sub font-body2">
              <th className="w-[14%] px-4 py-4 font-normal border-b border-bg-disabled/90">
                날짜
              </th>
              <th className="w-[14%] px-4 py-4 font-normal text-right border-b border-bg-disabled">
                비용(지출)
              </th>
              <th className="w-[12%] px-4 py-4 font-normal text-right border-b border-bg-disabled">
                노출 수
              </th>
              <th className="w-[12%] px-4 py-4 font-normal text-right border-b border-bg-disabled">
                클릭 수
              </th>
              <th className="w-[12%] px-4 py-4 font-normal text-right border-b border-bg-disabled">
                CTR(클릭률)
              </th>
              <th className="w-[12%] px-4 py-4 font-normal text-right border-b border-bg-disabled">
                CPC
              </th>
              <th className="w-[12%] px-4 py-4 font-normal text-right border-b border-bg-disabled">
                전환 수
              </th>
              <th className="w-[12%] px-4 py-4 font-normal text-right border-b border-bg-disabled">
                ROAS
              </th>
            </tr>
          </thead>
          <tbody className="text-text-main font-body2">
            {/* 합계 행 */}
            {total && (
              <tr className="sticky top-13 z-10 bg-white/95 backdrop-blur-sm font-bold border-b-2 border-bg-disabled">
                <td className="px-4 py-5 border-b border-bg-disabled">합계</td>
                <td className="px-4 py-5 text-right tabular-nums border-b border-bg-disabled text-brand-main">
                  ₩{total.spend.toLocaleString()}
                </td>
                <td className="px-4 py-5 text-right tabular-nums border-b border-bg-disabled">
                  {total.impressions.toLocaleString()}
                </td>
                <td className="px-4 py-5 text-right tabular-nums border-b border-bg-disabled">
                  {total.clicks.toLocaleString()}
                </td>
                <td className="px-4 py-5 text-right tabular-nums border-b border-bg-disabled">
                  {total.ctr.toFixed(2)}%
                </td>
                <td className="px-4 py-5 text-right tabular-nums border-b border-bg-disabled">
                  ₩{Math.round(total.cpc).toLocaleString()}
                </td>
                <td className="px-4 py-5 text-right tabular-nums border-b border-bg-disabled">
                  {total.conversions.toLocaleString()}
                </td>
                <td className="px-4 py-5 text-right tabular-nums border-b border-bg-disabled text-brand-main">
                  {Math.round(total.roas)}%
                </td>
              </tr>
            )}
            {/* 일별 데이터 */}
            {data.map((row, idx) => (
              <tr
                key={idx}
                className="hover:bg-bg-surface/30 transition-colors group"
              >
                <td className="px-4 py-4 text-text-sub border-b border-bg-disabled/20 truncate">
                  {row.date}
                </td>
                <td className="px-4 py-4 text-right tabular-nums text-text-main border-b border-bg-disabled/20">
                  ₩{row.spend.toLocaleString()}
                </td>
                <td className="px-4 py-4 text-right tabular-nums text-text-main border-b border-bg-disabled/20">
                  {row.impressions.toLocaleString()}
                </td>
                <td className="px-4 py-4 text-right tabular-nums text-text-main border-b border-bg-disabled/20">
                  {row.clicks.toLocaleString()}
                </td>
                <td className="px-4 py-4 text-right tabular-nums text-text-main border-b border-bg-disabled/20">
                  {row.ctr.toFixed(2)}%
                </td>
                <td className="px-4 py-4 text-right tabular-nums text-text-main border-b border-bg-disabled/20">
                  ₩{row.cpc.toLocaleString()}
                </td>
                <td className="px-4 py-4 text-right tabular-nums text-text-main border-b border-bg-disabled/20">
                  {row.conversions.toLocaleString()}
                </td>
                <td className="px-4 py-4 text-right tabular-nums text-text-main font-medium border-b border-bg-disabled/20">
                  {row.roas}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PlatformDetailTable;
