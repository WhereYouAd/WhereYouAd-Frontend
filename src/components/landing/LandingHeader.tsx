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

  el.scrollIntoView({ behavior: "smooth" });

  // 섹션으로 이동한 뒤 키보드 사용자도 맥락을 잃지 않도록 포커스를 함께 이동
  window.setTimeout(() => {
    el.focus({ preventScroll: true });
  }, 300);
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
      className={`sticky top-0 w-full z-50 flex items-center justify-between px-6 md:px-12 transition-smooth h-[var(--landing-header-height,64px)] ${
        isScrolled
          ? "bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] border-transparent"
          : "bg-brand-200/60 backdrop-blur-xl border-chart-inactive"
      }`}
    >
      <div className="flex items-center">
        <Link
          to="/"
          aria-label="WhereYouAd 홈"
          className="flex items-center gap-2 text-text-main rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-logo-2/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        >
          <img src={logoSvg} alt="" aria-hidden className="h-5 w-auto" />
        </Link>
      </div>

      <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
        {navItems.map(({ label, targetId }) => (
          <button
            key={targetId}
            type="button"
            onClick={() => scrollToSection(targetId)}
            className="text-[15px] font-medium text-text-sub hover:text-text-main transition-colors rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-logo-2/35 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            {label}
          </button>
        ))}
      </nav>

      <div className="ml-auto flex items-center gap-2 md:gap-3 shrink-0">
        <Link
          to="/login"
          className="text-[13px] md:text-[14px] font-medium text-text-sub rounded-xl px-3 py-2 md:px-3.5 transition-colors hover:bg-[#EDEDF0] hover:text-text-main focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-logo-2/35 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        >
          로그인
        </Link>
        <Link
          to="/signup"
          className="text-[13px] md:text-[14px] font-semibold text-white rounded-xl px-3 py-2 md:px-3.5 bg-logo-2 hover:bg-logo-2-dark transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-logo-2/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        >
          회원가입
        </Link>
      </div>
    </header>
  );
}
