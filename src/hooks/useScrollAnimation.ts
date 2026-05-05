import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import type { Variants } from "framer-motion";
import { useAnimation, useReducedMotion } from "framer-motion";

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

// reduced-motion: 위치 이동 없이 opacity만 페이드
const reducedFadeUp: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
};

const reducedStaggerItem: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
};

const reducedStaggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

export function useScrollAnimation(threshold = 0.15) {
  const controls = useAnimation();
  const prefersReduced = useReducedMotion();
  const [ref, inView] = useInView({ threshold, triggerOnce: true });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return {
    ref,
    controls,
    fadeUp: prefersReduced ? reducedFadeUp : fadeUp,
    fadeIn,
    staggerContainer: prefersReduced
      ? reducedStaggerContainer
      : staggerContainer,
    staggerItem: prefersReduced ? reducedStaggerItem : staggerItem,
  };
}
