import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion, useScroll } from "framer-motion";

export default function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    return scrollY.on("change", (y) => setScrolled(y > 50));
  }, [scrollY]);

  return (
    <motion.header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-white/10 bg-gray-950/80 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
      initial={prefersReduced ? false : { opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* 로고 */}
        <Link
          to="/"
          className="text-base font-extrabold tracking-tight text-white transition-opacity hover:opacity-80"
        >
          Where you ad
        </Link>

        {/* 네비게이션 링크 */}
        <nav className="hidden items-center gap-7 md:flex">
          <a
            href="#features"
            className="text-sm text-white/60 transition-colors hover:text-white"
          >
            기능
          </a>
          <a
            href="#how-it-works"
            className="text-sm text-white/60 transition-colors hover:text-white"
          >
            작동 방식
          </a>
        </nav>

        {/* 우측 CTA */}
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="hidden text-sm font-medium text-white/70 transition-colors hover:text-white md:block"
          >
            로그인
          </Link>
          <Link
            to="/signup"
            state={{ step: 1 }}
            className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-indigo-500 active:scale-95"
          >
            무료 시작
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
