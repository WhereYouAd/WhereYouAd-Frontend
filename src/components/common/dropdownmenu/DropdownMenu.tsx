import React, { useEffect, useRef, useState } from "react";

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
}: {
  trigger: React.ReactNode;
  items: TMenuItem[];
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

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
    <div ref={ref} className={["relative inline-block", className].join(" ")}>
      <div
        role="button"
        tabIndex={0}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen((v) => !v);
          }
        }}
      >
        {trigger}
      </div>
      {open && (
        <div className="absolute left-0 mt-2 w-72 rounding-15 bg-brand-200 py-3 px-1 shadow-Medium">
          <div className="space-y-1">
            {items.map((it, idx) => (
              <div key={idx} className="px-2">
                <button
                  type="button"
                  onClick={() => {
                    it.onClick();
                    setOpen(false);
                  }}
                  className={[
                    "flex w-full items-center gap-3 rounding-15 px-5 py-4 text-left font-body1 transition-fast",
                    it.active
                      ? "bg-brand-300 text-status-blue"
                      : "text-text-main hover:bg-brand-300",
                  ].join(" ")}
                >
                  {it.icon}
                  <span
                    className={[
                      "whitespace-nowrap",
                      it.active ? "font-semibold" : "font-medium",
                    ].join(" ")}
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
