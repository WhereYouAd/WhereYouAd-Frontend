import React, {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { twMerge } from "tailwind-merge";

export type TDropdownPlacement = "bottom" | "top" | "auto";

export type TMenuItem = {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  danger?: boolean;
  labelClassName?: string;
};

const easeOut = [0, 0, 0.2, 1] as const;
const easeIn = [0.4, 0, 1, 1] as const;

const MENU_ITEM_HEIGHT = 52;
const MENU_VERTICAL_PADDING = 32;
const DEFAULT_MENU_WIDTH = 224;

function getClippingBounds(element: HTMLElement) {
  let bottom = window.innerHeight;
  let top = 0;
  let left = 0;
  let right = window.innerWidth;
  let parent = element.parentElement;

  while (parent) {
    const { overflow, overflowY, overflowX } = getComputedStyle(parent);
    const clips =
      overflow === "hidden" ||
      overflowY === "hidden" ||
      overflowY === "auto" ||
      overflowY === "scroll" ||
      overflowX === "hidden" ||
      overflowX === "auto" ||
      overflowX === "scroll";

    if (clips) {
      const rect = parent.getBoundingClientRect();
      bottom = Math.min(bottom, rect.bottom);
      top = Math.max(top, rect.top);
      left = Math.max(left, rect.left);
      right = Math.min(right, rect.right);
    }

    parent = parent.parentElement;
  }

  return { top, bottom, left, right };
}

function resolveAutoPlacement(
  element: HTMLElement,
  itemCount: number,
): "bottom" | "top" {
  const triggerRect = element.getBoundingClientRect();
  const { top: containerTop, bottom: containerBottom } =
    getClippingBounds(element);
  const estimatedMenuHeight =
    itemCount * MENU_ITEM_HEIGHT + MENU_VERTICAL_PADDING;
  const spaceBelow = containerBottom - triggerRect.bottom;
  const spaceAbove = triggerRect.top - containerTop;

  const visibleHeight = containerBottom - containerTop;

  const inLowerArea =
    visibleHeight > 0 &&
    triggerRect.bottom > containerTop + visibleHeight * 0.65;

  if (inLowerArea && spaceAbove >= estimatedMenuHeight) {
    return "top";
  }

  return spaceBelow < estimatedMenuHeight && spaceAbove >= estimatedMenuHeight
    ? "top"
    : "bottom";
}

function resolveHorizontalAlign(
  element: HTMLElement,
  menuWidth = DEFAULT_MENU_WIDTH,
): "left" | "right" {
  const triggerRect = element.getBoundingClientRect();
  const { left: containerLeft, right: containerRight } =
    getClippingBounds(element);
  const spaceLeft = triggerRect.right - containerLeft;
  const spaceRight = containerRight - triggerRect.left;

  if (spaceLeft < menuWidth && spaceRight > spaceLeft) {
    return "left";
  }
  return "right";
}

export function DropdownMenu({
  trigger,
  items,
  className,
  menuClassName,
  fullWidth = false,
  placement = "bottom",
  inFlow = false,
  "aria-label": ariaLabel,
  onOpenChange,
}: {
  trigger: React.ReactNode | ((open: boolean) => React.ReactNode);
  items: TMenuItem[];
  className?: string;
  menuClassName?: string;
  /** 트리거와 동일 너비로 패널을 펼침 (폼 필드용) */
  fullWidth?: boolean;
  /** bottom: 아래 / top: 위 / auto: 공간에 따라 자동 */
  placement?: TDropdownPlacement;
  inFlow?: boolean;
  "aria-label"?: string;
  onOpenChange?: (open: boolean) => void;
}) {
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [resolvedPlacement, setResolvedPlacement] = useState<"bottom" | "top">(
    "bottom",
  );
  const [horizontalAlign, setHorizontalAlign] = useState<"left" | "right">(
    "right",
  );
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

  useLayoutEffect(() => {
    if (!open || inFlow) {
      setResolvedPlacement("bottom");
      setHorizontalAlign("right");
      return;
    }

    const el = ref.current;
    if (!el) return;

    const updatePosition = () => {
      if (placement === "bottom") {
        setResolvedPlacement("bottom");
      } else if (placement === "top") {
        setResolvedPlacement("top");
      } else {
        setResolvedPlacement(resolveAutoPlacement(el, items.length));
      }

      if (!fullWidth) {
        setHorizontalAlign(resolveHorizontalAlign(el));
      } else {
        setHorizontalAlign("right");
      }
    };

    updatePosition();

    window.addEventListener("resize", updatePosition);

    window.addEventListener("scroll", updatePosition, true);

    const resizeObserver = new ResizeObserver(updatePosition);
    resizeObserver.observe(el);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
      resizeObserver.disconnect();
    };
  }, [open, placement, items.length, inFlow, fullWidth]);

  useEffect(() => {
    onOpenChange?.(open);
  }, [open, onOpenChange]);

  const isTopPlacement = !inFlow && resolvedPlacement === "top";
  const isLeftAlign = !inFlow && !fullWidth && horizontalAlign === "left";

  return (
    <div
      ref={ref}
      className={twMerge(
        "relative",
        fullWidth ? "block w-full" : "inline-block",
      )}
    >
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
            style={{
              transformOrigin: fullWidth
                ? isTopPlacement
                  ? "bottom center"
                  : "top center"
                : isTopPlacement
                  ? isLeftAlign
                    ? "bottom left"
                    : "bottom right"
                  : isLeftAlign
                    ? "top left"
                    : "top right",
            }}
            className={twMerge(
              "absolute z-50 rounded-2xl border border-surface-300 bg-surface-100 py-3 px-1 shadow-Soft",
              inFlow
                ? "relative mt-2"
                : twMerge(
                    "absolute",
                    isTopPlacement ? "bottom-full mb-2" : "top-full mt-2",
                  ),
              fullWidth
                ? "left-0 right-0 w-full"
                : twMerge(
                    "w-56 max-w-[calc(100vw-40px)]",
                    isLeftAlign ? "left-0 right-auto" : "right-0",
                  ),
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
            <div
              className={twMerge(
                "space-y-1",
                fullWidth &&
                  !inFlow &&
                  "max-h-60 overflow-y-auto overscroll-contain",
              )}
            >
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
                      "group flex w-full items-center justify-between rounded-2xl px-5 py-4 text-left font-body2 transition-ui-fast",
                      it.danger
                        ? "text-info-red hover:bg-info-red/10 hover:text-info-red"
                        : it.active
                          ? "bg-info-blue/10 text-info-blue"
                          : "text-text-body hover:bg-primary-100/50 hover:text-info-blue",
                    )}
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      {it.icon ? (
                        <span
                          className={twMerge(
                            "inline-flex h-5 w-5 items-center justify-center text-text-body",
                            it.danger
                              ? "text-info-red group-hover:text-info-red"
                              : it.active
                                ? "text-info-blue"
                                : "group-hover:text-info-blue",
                          )}
                          aria-hidden="true"
                        >
                          {it.icon}
                        </span>
                      ) : null}
                      <span
                        className={twMerge(
                          "min-w-0 truncate font-body2 text-left",
                          it.active && "font-label",
                          it.danger &&
                            "text-info-red group-hover:text-info-red",
                          it.labelClassName,
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
