import { memo, useMemo } from "react";

import type { IAdCount } from "@/types/dashboard/platform";

const PLATFORM_COLORS: Record<string, string> = {
  GOOGLE: "#f9ab00",
  NAVER: "#03c75a",
  META: "#1877f2",
};

export const AdStatusChart = memo(({ data }: { data: IAdCount[] }) => {
  const total = useMemo(
    () => data.reduce((acc, curr) => acc + curr.count, 0),
    [data],
  );

  const getWidth = (count: number) => (total > 0 ? (count / total) * 100 : 0);

  return (
    <div className="flex flex-1 flex-col gap-1 justify-center px-3">
      {/* 개수 라벨 */}
      <div className="flex w-full h-6 relative">
        {data.map((item) => (
          <div
            key={item.provider}
            style={{ width: `${getWidth(item.count)}%` }}
            className="flex justify-center text-caption text-text-sub tabular-nums"
          >
            {item.count}개
          </div>
        ))}
      </div>

      {/* 세그먼트 바 */}
      <div className="flex w-full h-10 rounded-lg gap-1.5">
        {data.map((item) => (
          <div
            key={item.provider}
            style={{
              width: `${getWidth(item.count)}%`,
              backgroundColor: PLATFORM_COLORS[item.provider],
            }}
            className="h-full rounded-sm"
          />
        ))}
      </div>
    </div>
  );
});

export default AdStatusChart;
