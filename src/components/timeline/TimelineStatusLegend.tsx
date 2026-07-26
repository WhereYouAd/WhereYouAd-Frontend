import { useId } from "react";
import { twMerge } from "tailwind-merge";

import {
  TIMELINE_PERFORMANCE_STATUS_STYLE,
  TIMELINE_STATUS_BASELINE_HELP,
  TIMELINE_STATUS_LEGEND_ORDER,
} from "@/constants/timeline/statusStyle";

interface ITimelineStatusLegendProps {
  className?: string;
}

export default function TimelineStatusLegend({
  className,
}: ITimelineStatusLegendProps) {
  const helpId = useId();

  return (
    <div
      className={twMerge(
        "flex min-w-0 w-full flex-wrap items-center justify-between gap-4 rounded-2xl bg-surface-200 px-5 py-3",
        className,
      )}
    >
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-8 gap-y-2">
        {TIMELINE_STATUS_LEGEND_ORDER.map((status) => {
          const style = TIMELINE_PERFORMANCE_STATUS_STYLE[status];

          return (
            <div
              key={status}
              className="flex min-w-0 items-center gap-2 font-body2"
            >
              <span
                className={twMerge("h-2 w-2 shrink-0 rounded-full", style.dot)}
                aria-hidden
              />
              <span className="shrink-0 text-text-title">{style.label}</span>
              <span className="text-text-placeholder" aria-hidden>
                :
              </span>
              <span className="text-text-muted">{style.legendDescription}</span>
            </div>
          );
        })}
      </div>

      <div className="group/help relative shrink-0">
        <button
          type="button"
          aria-describedby={helpId}
          className={twMerge(
            "flex h-6 w-6 items-center justify-center rounded-full",
            "border border-surface-400/70 font-caption text-text-muted",
            "transition-ui-smooth hover:bg-surface-300 hover:text-text-body",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400/40",
          )}
        >
          ?
        </button>

        <div
          id={helpId}
          role="tooltip"
          className={twMerge(
            "pointer-events-none absolute right-0 top-full z-50 mt-2 w-72",
            "rounded-2xl border border-surface-300 bg-surface-100 px-4 py-3 shadow-Soft",
            "font-body2 text-text-body opacity-0 transition-opacity duration-200",
            "group-hover/help:opacity-100 group-focus-within/help:opacity-100",
          )}
        >
          {TIMELINE_STATUS_BASELINE_HELP}
        </div>
      </div>
    </div>
  );
}
