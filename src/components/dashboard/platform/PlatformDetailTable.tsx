import { useMemo } from "react";

import type { IPlatformDailyPerformance } from "@/pages/dashboard/platform/platformDashboard.mock";

interface IPlatformDetailTableProps {
  data: IPlatformDailyPerformance[];
}

function PlatformDetailTable({ data }: IPlatformDetailTableProps) {
  // 합계 계산
  const total = useMemo(() => {
    if (!data.length) return null;
    const totalSpend = data.reduce((acc, curr) => acc + curr.spend, 0);
    const totalImpressions = data.reduce(
      (acc, curr) => acc + curr.impressions,
      0,
    );
    const totalClicks = data.reduce((acc, curr) => acc + curr.clicks, 0);
    const totalConversions = data.reduce(
      (acc, curr) => acc + curr.conversions,
      0,
    );
    return {
      spend: totalSpend,
      impressions: totalImpressions,
      clicks: totalClicks,
      ctr: totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0,
      cpc: totalClicks > 0 ? totalSpend / totalClicks : 0,
      conversions: totalConversions,
      roas:
        totalSpend > 0
          ? data.reduce((acc, curr) => acc + curr.roas * curr.spend, 0) /
            totalSpend
          : 0,
    };
  }, [data]);

  return (
    <div className="mt-4 flex flex-col">
      <div className="overflow-auto max-h-125 relative platform-table-scrollbar border-t border-surface-400">
        <table className="w-full text-left border-separate border-spacing-0 min-w-200 table-fixed">
          <thead className="sticky top-0 z-20 bg-surface-100">
            <tr className="text-text-muted font-body2">
              <th className="w-[14%] border-b border-surface-400/90 px-4 py-4">
                날짜
              </th>
              <th className="w-[14%] border-b border-surface-400 px-4 py-4 text-right">
                비용(지출)
              </th>
              <th className="w-[12%] border-b border-surface-400 px-4 py-4 text-right">
                노출 수
              </th>
              <th className="w-[12%] border-b border-surface-400 px-4 py-4 text-right">
                클릭 수
              </th>
              <th className="w-[12%] border-b border-surface-400 px-4 py-4 text-right">
                CTR(클릭률)
              </th>
              <th className="w-[12%] border-b border-surface-400 px-4 py-4 text-right">
                CPC
              </th>
              <th className="w-[12%] border-b border-surface-400 px-4 py-4 text-right">
                전환 수
              </th>
              <th className="w-[12%] border-b border-surface-400 px-4 py-4 text-right">
                ROAS
              </th>
            </tr>
          </thead>
          <tbody className="text-text-title font-body2">
            {/* 합계 행 */}
            {total && (
              <tr className="sticky top-13 z-10 border-b-2 border-surface-400 bg-surface-100/95 font-body1 backdrop-blur-sm">
                <td className="px-4 py-5 border-b border-surface-400">합계</td>
                <td className="px-4 py-5 text-right tabular-nums border-b border-surface-400 text-primary-500">
                  ₩{total.spend.toLocaleString()}
                </td>
                <td className="px-4 py-5 text-right tabular-nums border-b border-surface-400">
                  {total.impressions.toLocaleString()}
                </td>
                <td className="px-4 py-5 text-right tabular-nums border-b border-surface-400">
                  {total.clicks.toLocaleString()}
                </td>
                <td className="px-4 py-5 text-right tabular-nums border-b border-surface-400">
                  {total.ctr.toFixed(2)}%
                </td>
                <td className="px-4 py-5 text-right tabular-nums border-b border-surface-400">
                  ₩{Math.round(total.cpc).toLocaleString()}
                </td>
                <td className="px-4 py-5 text-right tabular-nums border-b border-surface-400">
                  {total.conversions.toLocaleString()}
                </td>
                <td className="px-4 py-5 text-right tabular-nums border-b border-surface-400 text-primary-500">
                  {Math.round(total.roas)}%
                </td>
              </tr>
            )}
            {/* 일별 데이터 */}
            {data.map((row, idx) => (
              <tr
                key={idx}
                className="hover:bg-surface-200/30 transition-colors group"
              >
                <td className="px-4 py-4 text-text-muted border-b border-surface-400/20 truncate">
                  {row.date}
                </td>
                <td className="px-4 py-4 text-right tabular-nums text-text-title border-b border-surface-400/20">
                  ₩{row.spend.toLocaleString()}
                </td>
                <td className="px-4 py-4 text-right tabular-nums text-text-title border-b border-surface-400/20">
                  {row.impressions.toLocaleString()}
                </td>
                <td className="px-4 py-4 text-right tabular-nums text-text-title border-b border-surface-400/20">
                  {row.clicks.toLocaleString()}
                </td>
                <td className="px-4 py-4 text-right tabular-nums text-text-title border-b border-surface-400/20">
                  {row.ctr.toFixed(2)}%
                </td>
                <td className="px-4 py-4 text-right tabular-nums text-text-title border-b border-surface-400/20">
                  ₩{row.cpc.toLocaleString()}
                </td>
                <td className="px-4 py-4 text-right tabular-nums text-text-title border-b border-surface-400/20">
                  {row.conversions.toLocaleString()}
                </td>
                <td className="border-b border-surface-400/20 px-4 py-4 text-right tabular-nums text-text-title">
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
