import { memo, useMemo } from "react";
import { twMerge } from "tailwind-merge";

import type { IAdCount } from "@/types/dashboard/platform";

const PLATFORM_COLORS: Record<string, string> = {
  GOOGLE: "bg-status-blue",
  NAVER: "bg-status-green",
  META: "bg-text-auth-sub",
};

export const AdStatusChart = memo(({ data }: { data: IAdCount[] }) => {
  const total = useMemo(
    () => data.reduce((acc, curr) => acc + curr.count, 0),
    [data],
  );

  return (
    <div className="flex flex-1 flex-col gap-1 justify-center px-3">
      {/* 개수 라벨 */}
      <div className="flex w-full h-6 relative">
        {data.map((item) => (
          <div
            key={item.provider}
            style={{ width: `${(item.count / total) * 100}%` }}
            className="flex justify-center text-caption text-text-sub tabular-nums"
          >
            {item.count}개
          </div>
        ))}
      </div>

      {/* 세그먼트 바 */}
      <div className="flex w-full h-10 rounded-component-sm gap-1.5">
        {data.map((item) => (
          <div
            key={item.provider}
            style={{ width: `${(item.count / total) * 100}%` }}
            className={twMerge(
              PLATFORM_COLORS[item.provider],
              "h-full rounded-sm",
            )}
          />
        ))}
      </div>
    </div>
  );
});

export default AdStatusChart;
