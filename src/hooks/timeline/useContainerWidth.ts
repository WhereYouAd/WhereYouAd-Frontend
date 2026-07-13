import { type RefObject, useEffect, useState } from "react";

export function useContainerWidth(
  ref: RefObject<HTMLElement | null>,
  enabled = true,
) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (!enabled) return;

    const el = ref.current;
    if (!el) return;

    const update = () => {
      setWidth(el.clientWidth);
    };
    update();

    const observer = new ResizeObserver(update);
    observer.observe(el);

    return () => observer.disconnect();
  }, [ref, enabled]);

  return width;
}
