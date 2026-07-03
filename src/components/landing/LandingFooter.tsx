import { Link } from "react-router-dom";

import logoSvg from "@/assets/logo/service-logo/logo.svg";

import footerBg from "@/assets/mockup/footer_bg.jpg";

const serviceLinks = [
  { label: "기능", href: "/#features" },
  { label: "이용방법", href: "/#guide" },
  { label: "요금제", href: "/#pricing" },
  { label: "FAQ", href: "/#faq" },
];

const startLinks = [
  { label: "로그인", href: "/login" },
  { label: "회원가입", href: "/signup" },
];

const legalLinks = [
  {
    label: "이용약관",
    href: "https://www.notion.so/Where-you-ad-351085b3a16c8040b7bef7ac311da984?source=copy_link",
  },
  {
    label: "개인정보처리방침",
    href: "https://www.notion.so/Where-you-ad-351085b3a16c80c3b171f97238e447ca?source=copy_link",
  },
];

const linkBaseClass =
  "font-body1 hover:text-primary-500 transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400/35 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-100";

// 구분선 위: 연한 회색
const linkClass = `${linkBaseClass} text-text-muted`;
// 구분선 아래: 더 연한 회색
const legalLinkClass = `${linkBaseClass} text-text-disabled`;

export default function LandingFooter() {
  return (
    <footer className="bg-surface-100 text-text-title">
      <div className="max-w-7xl mx-auto px-6 pt-16">
        {/* CTA 박스 */}
        <div className="relative overflow-hidden rounded-3xl px-8 py-14 text-center sm:px-16 sm:py-16">
          <img
            src={footerBg}
            alt=""
            aria-hidden
            className="absolute inset-0 z-0 h-full w-full object-cover object-center"
          />
          <div
            className="pointer-events-none absolute inset-0 z-1 bg-text-400/45"
            aria-hidden
          />
          <p className="relative z-10 break-keep font-heading2 text-surface-100">
            지금 바로 시작해보세요.
          </p>
          <p className="relative z-10 mt-2 break-keep font-body1 text-surface-100/85">
            네이버, 구글, 메타 데이터를 한 곳에서 확인하는 가장 쉬운 방법.
          </p>
          <Link
            to="/signup"
            className="relative z-10 mt-6 inline-flex items-center justify-center rounded-full bg-primary-400 px-8 py-3 font-heading4 text-surface-100 shadow-Soft transition-colors hover:bg-primary-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400/35 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-500"
          >
            무료로 시작하기
          </Link>
        </div>

        {/* 로고 */}
        <img src={logoSvg} alt="WhereYouAd" className="mt-16 h-7 w-auto" />

        {/* 고객센터 정보 / 링크 컬럼 */}
        <div className="mt-10 flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
          {/* 왼쪽: 고객센터 */}
          <div className="flex flex-col gap-4 lg:w-72 shrink-0">
            <p className="font-body1 text-text-muted">고객센터</p>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-3">
                <span className="font-body1 text-text-muted">메일</span>
                <a href="mailto:whereyouad@gmail.com" className={linkClass}>
                  whereyouad@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* 오른쪽: 링크 컬럼 */}
          <div className="flex flex-row gap-16 sm:gap-24">
            <ul className="flex flex-col gap-3">
              {serviceLinks.map(({ label, href }) => (
                <li key={href}>
                  <a href={href} className={linkClass}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>

            <ul className="flex flex-col gap-3">
              {startLinks.map(({ label, href }) => (
                <li key={href}>
                  <Link to={href} className={linkClass}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 구분선: 컨테이너 폭 제한 없이 끝까지 확장 */}
      <div className="mt-14 border-t border-surface-400/90" />

      <div className="max-w-7xl mx-auto px-6 pb-10">
        {/* 하단 바 */}
        <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          {/* 왼쪽: 사업자 정보 */}
          {/* TODO: 대표자명, 사업자등록번호 등 확정 시 아래 줄에 추가 */}
          <p className="font-body2 text-text-disabled">
            (주)웨얼유애드 | 서울시 종로구 홍지문 2길 20 상명대학교
          </p>

          {/* 오른쪽: 법적 링크 + 저작권 */}
          <div className="flex flex-col items-start gap-2 md:items-end">
            <div className="flex items-center gap-5">
              {legalLinks.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className={legalLinkClass}
                >
                  {label}
                </a>
              ))}
            </div>
            <p className="font-body2 text-text-disabled">
              © 2026 WhereYouAd. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
