import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { LANDING_FAQ_ITEMS } from "@/constants/landing/faq";

import LandingSectionHeader from "@/components/landing/LandingSectionHeader";

import ChevronDownIcon from "@/assets/icon/chevron/chevron-down.svg?react";

export default function LandingFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function toggle(idx: number) {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  }

  return (
    <section
      id="faq"
      tabIndex={-1}
      className="py-24 md:py-32 bg-surface-100 scroll-mt-[calc(var(--landing-header-height,64px)+16px)] focus-visible:outline-none"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <LandingSectionHeader title="자주 묻는 질문" />
        </div>

        <div className="mt-14 max-w-4xl mx-auto divide-y divide-surface-400/60">
          {LANDING_FAQ_ITEMS.map(({ q, a }, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={q}>
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 py-6 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400/35 focus-visible:rounded"
                >
                  <h3 className="font-heading4 text-text-title">{q}</h3>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="shrink-0 text-text-muted"
                  >
                    <ChevronDownIcon className="w-5 h-5" />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <p className="pb-6 break-keep font-body1 text-text-muted leading-relaxed">
                        {a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
