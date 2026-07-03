export const easeOut = [0, 0, 0.2, 1] as const;

export const containerVariants = {
  hidden: {},
  visible: (reduce: boolean) => ({
    transition: {
      staggerChildren: reduce ? 0 : 0.05,
      delayChildren: 0,
    },
  }),
};

export const itemVariants = {
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
