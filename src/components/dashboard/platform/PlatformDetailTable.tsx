import { useMemo } from "react";

import type { IPlatformDailyPerformance } from "@/types/dashboard/platform";

import { METRIC_REGISTRY as M } from "@/utils/dashboard/metricRegistry";

interface IPlatformDetailTableProps {
  data: IPlatformDailyPerformance[];
  total?: IPlatformDailyPerformance | null;
}

function PlatformDetailTable({
  data,
  total: totalFromApi,
}: IPlatformDetailTableProps) {
  // 합계 계산
  const computedTotal = useMemo(() => {
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
      cpa: totalConversions > 0 ? totalSpend / totalConversions : 0,
      conversions: totalConversions,
      roas:
        totalSpend > 0
          ? data.reduce((acc, curr) => acc + curr.roas * curr.spend, 0) /
            totalSpend
          : 0,
    };
  }, [data]);

  const total = totalFromApi ?? computedTotal;

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
                {M.spend.label}
              </th>
              <th className="w-[12%] border-b border-surface-400 px-4 py-4 text-right">
                {M.impressions.label}
              </th>
              <th className="w-[12%] border-b border-surface-400 px-4 py-4 text-right">
                {M.clicks.label}
              </th>
              <th className="w-[12%] border-b border-surface-400 px-4 py-4 text-right">
                {M.ctr.label}
              </th>
              <th className="w-[12%] border-b border-surface-400 px-4 py-4 text-right">
                {M.cpa.label}
              </th>
              <th className="w-[12%] border-b border-surface-400 px-4 py-4 text-right">
                {M.conversions.label}
              </th>
              <th className="w-[12%] border-b border-surface-400 px-4 py-4 text-right">
                {M.roas.label}
              </th>
            </tr>
          </thead>
          <tbody className="text-text-title font-body2">
            {/* 합계 행 */}
            {total && (
              <tr className="sticky top-13 z-10 border-b-2 border-surface-400 bg-surface-100/95 font-body1 backdrop-blur-sm">
                <td className="px-4 py-5 border-b border-surface-400">합계</td>
                <td className="px-4 py-5 text-right tabular-nums border-b border-surface-400 text-primary-500">
                  {M.spend.format(total.spend)}
                </td>
                <td className="px-4 py-5 text-right tabular-nums border-b border-surface-400">
                  {M.impressions.format(total.impressions)}
                </td>
                <td className="px-4 py-5 text-right tabular-nums border-b border-surface-400">
                  {M.clicks.format(total.clicks)}
                </td>
                <td className="px-4 py-5 text-right tabular-nums border-b border-surface-400">
                  {M.ctr.format(total.ctr)}
                </td>
                <td className="px-4 py-5 text-right tabular-nums border-b border-surface-400">
                  {M.cpa.format(total.cpa)}
                </td>
                <td className="px-4 py-5 text-right tabular-nums border-b border-surface-400">
                  {M.conversions.format(total.conversions)}
                </td>
                <td className="px-4 py-5 text-right tabular-nums border-b border-surface-400 text-primary-500">
                  {M.roas.formatTableTotal(total.roas)}
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
                  {M.spend.format(row.spend)}
                </td>
                <td className="px-4 py-4 text-right tabular-nums text-text-title border-b border-surface-400/20">
                  {M.impressions.format(row.impressions)}
                </td>
                <td className="px-4 py-4 text-right tabular-nums text-text-title border-b border-surface-400/20">
                  {M.clicks.format(row.clicks)}
                </td>
                <td className="px-4 py-4 text-right tabular-nums text-text-title border-b border-surface-400/20">
                  {M.ctr.format(row.ctr)}
                </td>
                <td className="px-4 py-4 text-right tabular-nums text-text-title border-b border-surface-400/20">
                  {M.cpa.format(row.cpa)}
                </td>
                <td className="px-4 py-4 text-right tabular-nums text-text-title border-b border-surface-400/20">
                  {M.conversions.format(row.conversions)}
                </td>
                <td className="border-b border-surface-400/20 px-4 py-4 text-right tabular-nums text-text-title">
                  {M.roas.formatTableRow(row.roas)}
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
