import { twMerge } from "tailwind-merge";

export interface IChartLegendItem {
  label: string;
  colorClass: string;
}

export interface IChartLegendProps {
  items: IChartLegendItem[];
  className?: string;
}

export default function ChartLegend({ items, className }: IChartLegendProps) {
  return (
    <div className={twMerge("flex items-center gap-4", className)}>
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-1.5">
          <div
            className={twMerge("w-1.5 h-1.5 rounded-full", item.colorClass)}
          />
          <span className="font-caption font-bold text-text-sub">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
