import PlatformDashboard from "@/assets/mockup/optimized/platform_dashboard.jpg";

export default function LandingSolutions() {
  return (
    <section className="py-24 bg-brand-200 text-center">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="font-heading1 text-text-main mb-16 leading-snug">
          스마트한 광고 관리로,
          <br />
          공간의 운영 효율은 완성됩니다.
        </h2>

        <div className="space-y-6 text-left">
          {/* Solution 1 */}
          <div className="bg-landing-section rounded-3xl p-10 flex flex-col md:flex-row items-center gap-12 border border-chart-inactive">
            <div className="flex-1">
              <span className="inline-block px-4 py-1.5 bg-text-main text-white text-xs font-bold rounded-full mb-6">
                Server
              </span>
              <h3 className="text-2xl font-bold text-text-main mb-4">
                중앙 데이터 허브
              </h3>
              <p className="font-body1 text-text-sub leading-relaxed">
                모든 마케팅 채널의 데이터를 수집하고 분석하는 강력한 서버
                인프라를 통해 통합적인 시각을 제공합니다.
              </p>
            </div>
            <div className="w-full md:w-1/2 h-56 rounded-2xl overflow-hidden border border-chart-inactive shadow-sm">
              <img
                src={PlatformDashboard}
                alt="플랫폼 대시보드 화면"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>

          {/* Solution 2 */}
          <div className="bg-landing-section rounded-3xl p-10 flex flex-col md:flex-row items-center gap-12 border border-chart-inactive">
            <div className="flex-1">
              <span className="inline-block px-4 py-1.5 bg-text-main text-white text-xs font-bold rounded-full mb-6">
                Client
              </span>
              <h3 className="text-2xl font-bold text-text-main mb-4">
                어디서든 접근 가능한 클라이언트
              </h3>
              <p className="font-body1 text-text-sub leading-relaxed">
                실시간으로 동기화되는 직관적인 인터페이스로 데스크탑, 태블릿,
                모바일 등 모든 환경을 지원합니다.
              </p>
            </div>
            <div className="w-full md:w-1/2 h-56 rounded-2xl overflow-hidden border border-chart-inactive shadow-sm">
              <img
                src={PlatformDashboard}
                alt="클라이언트 플랫폼 화면"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
