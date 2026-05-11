import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { twMerge } from "tailwind-merge";

export type TMenuItem = {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  active?: boolean;
};

const easeOut = [0, 0, 0.2, 1] as const;
const easeIn = [0.4, 0, 1, 1] as const;

export function DropdownMenu({
  trigger,
  items,
  className,
  menuClassName,
  "aria-label": ariaLabel,
}: {
  trigger: React.ReactNode | ((open: boolean) => React.ReactNode);
  items: TMenuItem[];
  className?: string;
  menuClassName?: string;
  "aria-label"?: string;
}) {
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const menuId = useId();

  const openMs = reduceMotion ? 0 : 0.2;
  const closeMs = reduceMotion ? 0 : 0.15;

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
      <AnimatePresence>
        {open ? (
          <motion.div
            key="dropdown-panel"
            id={menuId}
            role="menu"
            style={{ transformOrigin: "top right" }}
            className={twMerge(
              "absolute right-0 top-full z-50 mt-2 w-56 max-w-[calc(100vw-40px)] rounded-2xl border border-gray-100 bg-brand-200 py-3 px-1 shadow-Medium",
              menuClassName,
            )}
            initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{
              opacity: 0,
              scale: reduceMotion ? 1 : 0.96,
              transition: { duration: closeMs, ease: easeIn },
            }}
            transition={{ duration: openMs, ease: easeOut }}
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
                      "group flex w-full items-center justify-between rounded-2xl px-5 py-4 text-left font-body2 transition-fast",
                      it.active
                        ? "bg-status-blue/10 text-status-blue"
                        : "text-text-main hover:bg-status-blue/5 hover:text-status-blue",
                    )}
                  >
                    <div className="flex items-center gap-3">
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
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
