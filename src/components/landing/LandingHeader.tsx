import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import LogoImage from "@/assets/mockup/logo_test/logo_2.png";

const navItems = [
  { label: "기능", targetId: "features" },
  { label: "이용방법", targetId: "guide" },
  { label: "요금제", targetId: "pricing" },
];

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
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
      className={`sticky top-0 w-full z-50 flex items-center justify-between px-6 py-4 md:px-12 transition-smooth ${
        isScrolled
          ? "bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] border-transparent"
          : "bg-brand-200/60 backdrop-blur-xl border-chart-inactive"
      }`}
    >
      <div className="flex items-center">
        <Link
          to="/"
          aria-label="WhereYouAd 홈"
          className="flex items-center gap-2 text-text-main"
        >
          <img src={LogoImage} alt="" aria-hidden className="h-6 w-auto" />
        </Link>
      </div>

      <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
        {navItems.map(({ label, targetId }) => (
          <button
            key={targetId}
            type="button"
            onClick={() => scrollToSection(targetId)}
            className="text-[15px] font-medium text-text-sub hover:text-text-main transition-colors"
          >
            {label}
          </button>
        ))}
      </nav>

      <div aria-hidden className="w-8 md:w-24" />
    </header>
  );
}
