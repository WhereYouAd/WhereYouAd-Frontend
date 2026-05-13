import { memo } from "react";
import { twMerge } from "tailwind-merge";

export interface IChartLegendItem {
  label: string;
  colorClass?: string;
  color?: string;
}

export interface IChartLegendProps {
  items: IChartLegendItem[];
  className?: string;
}

const ChartLegend = memo(function ChartLegend({
  items,
  className,
}: IChartLegendProps) {
  return (
    <div className={twMerge("flex items-center gap-4", className)}>
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-1.5">
          <div
            className={twMerge("w-1.5 h-1.5 rounded-full", item.colorClass)}
            style={item.color ? { backgroundColor: item.color } : undefined}
          />
          <span className="font-caption text-text-muted">{item.label}</span>
        </div>
      ))}
    </div>
  );
});

export default ChartLegend;
