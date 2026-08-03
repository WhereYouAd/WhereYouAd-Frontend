import { Fragment, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

import WarningIcon from "@/assets/icon/ai/warning.svg?react";
import { containerVariants, itemVariants } from "@/lib/animation";

interface IErrorLayoutProps {
  title: string;
  description: string;
  actions: ReactNode;
}

function renderMultilineText(text: string) {
  // 실제 개행과 문자 그대로의 "\n" 둘 다 줄바꿈으로 처리
  return text.split(/\r?\n|\\n/).map((line, index) => (
    <Fragment key={index}>
      {index > 0 && <br />}
      {line}
    </Fragment>
  ));
}

function ErrorLayout({ title, description, actions }: IErrorLayoutProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center p-4">
      <motion.div
        className="flex w-full max-w-105 flex-col items-center rounded-4xl bg-surface-100 px-8 py-12 text-center shadow-Soft transition-ui-smooth tablet:px-6"
        role="status"
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
          className="mb-4 break-keep font-heading1 text-text-title"
          variants={itemVariants}
          custom={!!reduceMotion}
        >
          {renderMultilineText(title)}
        </motion.h1>

        <motion.p
          className="break-keep font-body1 leading-relaxed text-text-auth-sub"
          variants={itemVariants}
          custom={!!reduceMotion}
        >
          {renderMultilineText(description)}
        </motion.p>

        <motion.div
          className="mt-8 flex w-full flex-col gap-3"
          variants={itemVariants}
          custom={!!reduceMotion}
        >
          {actions}
        </motion.div>
      </motion.div>
    </div>
  );
}

export default ErrorLayout;
