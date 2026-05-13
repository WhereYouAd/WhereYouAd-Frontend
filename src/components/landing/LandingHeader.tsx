import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import logoSvg from "@/assets/logo/service-logo/logo.svg";

const navItems = [
  { label: "기능", targetId: "features" },
  { label: "이용방법", targetId: "guide" },
  { label: "요금제", targetId: "pricing" },
];

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!(el instanceof HTMLElement)) return;

  const prefersReducedMotion =
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

  el.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });

  if (prefersReducedMotion) {
    el.focus({ preventScroll: true });
    return;
  }
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      el.focus({ preventScroll: true });
    });
  });
}

export default function LandingHeader() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let rafId: number | null = null;

    function update() {
      rafId = null;
      const next = window.scrollY > 8;
      setIsScrolled((prev) => (prev === next ? prev : next));
    }

    function onScroll() {
      if (rafId != null) return;
      rafId = window.requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (rafId != null) window.cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <header
      className={`sticky top-0 w-full z-50 flex items-center justify-between px-6 md:px-12 transition-ui-smooth h-[var(--landing-header-height,64px)] ${
        isScrolled
          ? "bg-surface-100 shadow-landing-header border-transparent"
          : "bg-surface-100/80 backdrop-blur-xl border-surface-400"
      }`}
    >
      <div className="flex items-center">
        <Link
          to="/"
          aria-label="WhereYouAd 홈"
          className="flex items-center gap-2 text-text-title rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-100"
        >
          <img src={logoSvg} alt="" aria-hidden className="h-6 w-auto" />
        </Link>
      </div>

      <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
        {navItems.map(({ label, targetId }) => (
          <button
            key={targetId}
            type="button"
            onClick={() => scrollToSection(targetId)}
            className="text-[15px] font-medium text-text-body hover:text-text-title transition-colors rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400/35 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-100"
          >
            {label}
          </button>
        ))}
      </nav>

      <div className="ml-auto flex items-center gap-2 md:gap-3 shrink-0">
        <Link
          to="/login"
          className="text-[13px] md:text-[14px] font-medium text-text-body rounded-xl px-3 py-2 md:px-3.5 transition-colors hover:bg-surface-300 hover:text-text-title focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400/35 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-100"
        >
          로그인
        </Link>
        <Link
          to="/signup"
          className="text-[13px] md:text-[14px] font-semibold text-surface-100 rounded-xl px-3 py-2 md:px-3.5 bg-primary-400 hover:bg-primary-500 transition-colors shadow-landing-pill focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-100"
        >
          회원가입
        </Link>
      </div>
    </header>
  );
}
