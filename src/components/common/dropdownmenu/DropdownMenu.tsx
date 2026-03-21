import React, { useEffect, useId, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

export type TMenuItem = {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  active?: boolean;
};

export function DropdownMenu({
  trigger,
  items,
  className,
  "aria-label": ariaLabel,
}: {
  trigger: React.ReactNode | ((open: boolean) => React.ReactNode);
  items: TMenuItem[];
  className?: string;
  "aria-label"?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const menuId = useId();

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
    };
  }, []);

  return (
    <div ref={ref} className="relative inline-block">
      <div
        role="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={ariaLabel}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen((v) => !v);
          }
        }}
        className={twMerge(className)}
      >
        {typeof trigger === "function" ? trigger(open) : trigger}
      </div>
      {open && (
        <div
          id={menuId}
          role="menu"
          className="absolute right-0 top-full mt-2 w-56 max-w-[calc(100vw-40px)] rounded-component-md bg-brand-200 py-3 px-1 shadow-Medium z-50"
        >
          <div className="space-y-1">
            {items.map((it, idx) => (
              <div key={idx} className="px-2">
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    it.onClick();
                    setOpen(false);
                  }}
                  className={twMerge(
                    "group flex w-full items-center gap-3 rounded-component-md px-5 py-4 text-left font-body2 transition-fast",
                    it.active
                      ? "bg-brand-300 text-status-blue"
                      : "text-text-auth-sub hover:bg-brand-300 hover:text-status-blue",
                  )}
                >
                  {it.icon ? (
                    <span
                      className={twMerge(
                        "inline-flex h-5 w-5 items-center justify-center text-text-main",
                        it.active
                          ? "text-status-blue"
                          : "group-hover:text-status-blue",
                      )}
                      aria-hidden="true"
                    >
                      {it.icon}
                    </span>
                  ) : null}
                  <span
                    className={twMerge(
                      "whitespace-nowrap",
                      it.active ? "font-semibold" : "font-medium",
                    )}
                  >
                    {it.label}
                  </span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
