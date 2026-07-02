import { type CSSProperties, useEffect, useState } from "react";
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
  const [progress, setProgress] = useState(0);

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
    <header
      className={`fixed top-0 left-0 right-0 z-50 border-b transition-[box-shadow] duration-300 h-(--landing-header-height,64px) ${
        progress > 0.8 ? "shadow-Soft" : ""
      }`}
      style={headerStyle}
    >
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        {/* 왼쪽: 로고 + 네비게이션 */}
        <div className="flex items-center">
          <Link
            to="/"
            aria-label="WhereYouAd 홈"
            className="flex items-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400/40 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
          >
            {/* 컬러 로고와 흰색 로고를 progress에 비례해 교차 페이드 */}
            <div className="relative h-9">
              <img
                src={logoSvg}
                alt=""
                aria-hidden
                className="h-9 w-auto block"
                style={{ opacity: eased }}
              />
              <img
                src={logoSvg}
                alt=""
                aria-hidden
                className="h-9 w-auto absolute inset-0 brightness-0 invert"
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

        {/* 오른쪽: 로그인/회원가입 */}
        <div className="flex items-center gap-1 shrink-0">
          <Link
            to="/login"
            style={{ color: textColorBase }}
            className="rounded-xl px-3 py-2 font-body2 opacity-90 hover:opacity-100 transition-opacity duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400/35 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent md:px-3.5 md:font-body1"
          >
            로그인
          </Link>
          <Link
            to="/signup"
            className="group relative rounded-full px-3 py-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400/40 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
          >
            {/* 기본 필 배경 */}
            <span
              className="absolute inset-0 rounded-full"
              style={{ backgroundColor: pillBg }}
              aria-hidden
            />
            {/* 호버 시 동일 레이어 한 겹 더 얹어 자연스럽게 진해짐 */}
            <span
              className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-150 group-hover:opacity-100"
              style={{ backgroundColor: pillBg }}
              aria-hidden
            />
            <span
              className="relative font-label opacity-90 transition-opacity duration-150 group-hover:opacity-100"
              style={{ color: textColorBase }}
            >
              회원가입
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
