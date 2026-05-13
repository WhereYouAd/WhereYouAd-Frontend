import type { ReactNode } from "react";
import { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { twMerge } from "tailwind-merge";

import WarningIcon from "@/assets/icon/ai/warning.svg?react";

export interface IComingSoonPlaceholderProps {
  title: ReactNode;
  description: ReactNode;
  footer: ReactNode;
  className?: string;
}

const easeOut = [0, 0, 0.2, 1] as const;

const containerVariants = {
  hidden: {},
  visible: (reduce: boolean) => ({
    transition: {
      staggerChildren: reduce ? 0 : 0.05,
      delayChildren: 0,
    },
  }),
};

const itemVariants = {
  hidden: (reduce: boolean) => ({
    opacity: reduce ? 1 : 0,
    y: reduce ? 0 : 10,
  }),
  visible: (reduce: boolean) => ({
    opacity: 1,
    y: 0,
    transition: { duration: reduce ? 0 : 0.35, ease: easeOut },
  }),
};

const ComingSoonPlaceholder = memo(function ComingSoonPlaceholder({
  title,
  description,
  footer,
  className,
}: IComingSoonPlaceholderProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className={twMerge(
        "flex h-full min-h-[70vh] w-full flex-1 flex-col items-center justify-center p-4",
        className,
      )}
    >
      <motion.div
        className="flex w-full max-w-[420px] flex-col items-center rounded-[32px] bg-surface-100 px-8 py-12 text-center shadow-card transition-ui-smooth hover:shadow-card-hover tablet:px-6"
        role="status"
        aria-live="polite"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        custom={!!reduceMotion}
      >
        <motion.div
          className="mb-6 flex items-center justify-center"
          variants={itemVariants}
          custom={!!reduceMotion}
        >
          <WarningIcon className="h-30 w-auto shrink-0" aria-hidden />
        </motion.div>

        <motion.h1
          className="mb-4 text-balance font-heading1 text-text-title"
          variants={itemVariants}
          custom={!!reduceMotion}
        >
          {title}
        </motion.h1>

        <motion.p
          className="break-keep font-body1 leading-relaxed text-text-auth-sub"
          variants={itemVariants}
          custom={!!reduceMotion}
        >
          {description}
        </motion.p>

        <motion.div
          className="mt-8 flex w-full items-center justify-center rounded-2xl bg-surface-300 px-6 py-4"
          variants={itemVariants}
          custom={!!reduceMotion}
        >
          <p className="font-body1 text-text-title">{footer}</p>
        </motion.div>
      </motion.div>
    </div>
  );
});

export default ComingSoonPlaceholder;
