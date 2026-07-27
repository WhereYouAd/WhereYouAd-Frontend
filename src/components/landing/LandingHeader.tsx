import { type CSSProperties, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

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

  if (prefersReducedMotion) {
    el.scrollIntoView({ behavior: "auto" });
    el.focus({ preventScroll: true });
    return;
  }

  el.scrollIntoView({ behavior: "smooth" });

  // smooth scroll 완료 후 focus: scrollend 미지원 브라우저는 fallback timeout 사용
  if ("onscrollend" in window) {
    window.addEventListener(
      "scrollend",
      () => el.focus({ preventScroll: true }),
      {
        once: true,
      },
    );
  } else {
    setTimeout(() => el.focus({ preventScroll: true }), 600);
  }
}

export default function LandingHeader() {
  const [progress, setProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let rafId: number | null = null;

    function update() {
      rafId = null;
      const hero = document.getElementById("hero");
      const threshold = Math.max(
        (hero?.offsetHeight ?? window.innerHeight) * 0.4,
        1,
      );
      setProgress(Math.min(window.scrollY / threshold, 1));
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

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // ease-out quadratic: 스크롤 초반 빠르게 시작, 후반 부드럽게 수렴
  const eased = 1 - Math.pow(1 - progress, 2);

  // 텍스트 기본색: rgb(255,255,255) → rgb(55,65,81) (text-text-body = #374151)
  // alpha는 opacity 클래스로 분리해 hover에서 별도 제어
  const textColorBase = `rgb(${Math.round(255 - 200 * eased)},${Math.round(255 - 190 * eased)},${Math.round(255 - 174 * eased)})`;

  // 호버 필 배경: 텍스트와 동일한 RGB 기반, 낮은 알파로 반투명 처리
  // 투명 헤더(dark bg): rgba(255,255,255,0.12) / 불투명 헤더(light bg): rgba(55,65,81,0.07)
  const pillBg = `rgba(${Math.round(255 - 200 * eased)},${Math.round(255 - 190 * eased)},${Math.round(255 - 174 * eased)},${(0.12 - 0.05 * eased).toFixed(3)})`;

  const headerStyle = {
    backgroundColor: `rgba(255,255,255,${(eased * 0.82).toFixed(3)})`,
    backdropFilter: `blur(${(eased * 12).toFixed(1)}px)`,
    WebkitBackdropFilter: `blur(${(eased * 12).toFixed(1)}px)`,
    // border-surface-400 = #dde3f0 = rgb(221,227,240)
    borderBottomColor: `rgba(221,227,240,${eased.toFixed(3)})`,
  } as CSSProperties;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 border-b transition-shadow duration-300 h-(--landing-header-height,64px) ${
          progress > 0.8 ? "shadow-Soft" : ""
        }`}
        style={headerStyle}
      >
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          {/* 왼쪽: 로고 + 데스크탑 네비게이션 */}
          <div className="flex items-center">
            <Link
              to="/"
              aria-label="WhereYouAd 홈"
              className="flex items-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400/40 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
            >
              <div className="relative h-7 w-fit md:h-9">
                <img
                  src={logoSvg}
                  alt=""
                  aria-hidden
                  className="h-7 w-auto block md:h-9"
                  style={{ opacity: eased }}
                />
                <img
                  src={logoSvg}
                  alt=""
                  aria-hidden
                  className="h-7 w-auto absolute inset-0 brightness-0 invert md:h-9"
                  style={{ opacity: 1 - eased }}
                />
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-1 ml-10">
              {navItems.map(({ label, targetId }) => (
                <button
                  key={targetId}
                  type="button"
                  onClick={() => scrollToSection(targetId)}
                  className="group relative rounded-full px-3 py-1.5 font-body1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400/35 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                >
                  <span
                    className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-150 group-hover:opacity-100"
                    style={{ backgroundColor: pillBg }}
                    aria-hidden
                  />
                  <span
                    className="relative opacity-90 transition-opacity duration-150 group-hover:opacity-100"
                    style={{ color: textColorBase }}
                  >
                    {label}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          {/* 오른쪽: 로그인/회원가입(데스크탑) + 햄버거(모바일) */}
          <div className="flex items-center gap-2 md:gap-3 shrink-0">
            <Link
              to="/login"
              style={{ color: textColorBase }}
              className="hidden md:block rounded-xl px-3 py-2 md:px-3.5 font-body1 opacity-90 hover:opacity-100 transition-opacity duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400/35 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
            >
              로그인
            </Link>
            <Link
              to="/signup"
              className="hidden md:block rounded-xl bg-primary-400 px-3 py-2 md:px-3.5 font-body1 text-surface-100 shadow-Soft transition-colors hover:bg-primary-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400/40 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
            >
              회원가입
            </Link>

            {/* 햄버거 버튼 — 모바일 전용 */}
            <button
              type="button"
              aria-label={menuOpen ? "메뉴 닫기" : "메뉴 열기"}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="md:hidden flex flex-col justify-center items-center w-9 h-9 gap-1.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400/35 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
            >
              <span
                className="block h-0.5 w-5 rounded-full transition-all duration-200 origin-center"
                style={{
                  backgroundColor: textColorBase,
                  transform: menuOpen
                    ? "translateY(8px) rotate(45deg)"
                    : "none",
                }}
              />
              <span
                className="block h-0.5 w-5 rounded-full transition-all duration-200"
                style={{
                  backgroundColor: textColorBase,
                  opacity: menuOpen ? 0 : 1,
                }}
              />
              <span
                className="block h-0.5 w-5 rounded-full transition-all duration-200 origin-center"
                style={{
                  backgroundColor: textColorBase,
                  transform: menuOpen
                    ? "translateY(-8px) rotate(-45deg)"
                    : "none",
                }}
              />
            </button>
          </div>
        </div>
      </header>

      {/* 모바일 메뉴 패널 */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-nav"
            className="fixed left-0 right-0 z-40 md:hidden"
            style={{ top: "var(--landing-header-height, 64px)" }}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            <div
              className="border-b"
              style={{
                backgroundColor: "rgba(255,255,255,0.97)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                borderBottomColor: "rgba(221,227,240,1)",
              }}
            >
              <nav
                aria-label="모바일 네비게이션"
                className="flex flex-col px-4 py-3"
              >
                {navItems.map(({ label, targetId }) => (
                  <button
                    key={targetId}
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      scrollToSection(targetId);
                    }}
                    className="rounded-xl px-4 py-3.5 font-body1 text-text-title hover:bg-surface-200 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400/35 text-center"
                  >
                    {label}
                  </button>
                ))}

                <div className="mx-4 my-2 h-px bg-surface-300" />

                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl px-4 py-3.5 font-body1 text-text-title hover:bg-surface-200 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400/35 text-center"
                >
                  로그인
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMenuOpen(false)}
                  className="mt-1 rounded-xl px-4 py-3.5 font-heading4 text-primary-400 hover:bg-surface-200 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400/35 text-center"
                >
                  회원가입
                </Link>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 메뉴 오픈 시 배경 오버레이 */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-30 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            style={{ backgroundColor: "rgba(0,0,0,0.35)" }}
            onClick={() => setMenuOpen(false)}
            aria-hidden
          />
        )}
      </AnimatePresence>
    </>
  );
}
