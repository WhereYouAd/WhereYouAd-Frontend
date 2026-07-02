import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";

import Button from "@/components/common/button/Button";

import WarningIcon from "@/assets/icon/ai/warning.svg?react";

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

const NotFound = memo(function NotFound() {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center p-4">
      <motion.div
        className="flex w-full max-w-105 flex-col items-center rounded-4xl bg-surface-100 px-8 py-12 text-center shadow-Soft transition-ui-smooth tablet:px-6"
        role="alert"
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
          페이지를 찾을 수 없어요
        </motion.h1>

        <motion.p
          className="whitespace-pre-line break-keep font-body1 leading-relaxed text-text-auth-sub"
          variants={itemVariants}
          custom={!!reduceMotion}
        >
          {"요청하신 페이지가 존재하지 않거나\n주소가 변경되었을 수 있어요."}
        </motion.p>

        <motion.div
          className="mt-8 flex w-full flex-col gap-3"
          variants={itemVariants}
          custom={!!reduceMotion}
        >
          <Button
            size="big"
            variant="secondary"
            fullWidth
            onClick={() => navigate(-1)}
          >
            이전 페이지로
          </Button>
          <Button
            size="big"
            variant="primary"
            fullWidth
            onClick={() => navigate("/", { replace: true })}
          >
            홈으로 이동
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
});

export default NotFound;
