export default function LandingExperience() {
  return (
    <section className="py-24 bg-brand-200 text-center border-t border-chart-inactive">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="font-heading1 text-text-main mb-16">
          직접 체험해보면 다릅니다.
        </h2>

        <div className="grid md:grid-cols-2 gap-6 text-left">
          <div className="bg-linear-to-br from-[#f0f4ff] to-[#e0e7ff] p-10 rounded-[2rem] h-80 flex flex-col relative overflow-hidden group hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-smooth">
            <h3 className="font-heading2 text-text-main relative z-10">
              광고 성과 분석
            </h3>
            <p className="font-body1 text-text-sub mt-2 relative z-10">
              다양한 채널의 데이터를
              <br />한 곳에서 모니터링
            </p>
            <div className="absolute right-0 bottom-0 w-64 h-64 bg-linear-to-tl from-white/60 to-transparent rounded-tl-full -mr-10 -mb-10 group-hover:scale-110 transition-transform duration-700" />
          </div>

          <div className="bg-linear-to-br from-[#ecfdf5] to-[#d1fae5] p-10 rounded-[2rem] h-80 flex flex-col relative overflow-hidden group hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-smooth">
            <h3 className="font-heading2 text-text-main relative z-10">
              조직 맞춤 권한
            </h3>
            <p className="font-body1 text-text-sub mt-2 relative z-10">
              구성원 역할에 맞춘
              <br />
              세밀한 권한 설정
            </p>
            <div className="absolute right-0 bottom-0 w-64 h-64 bg-linear-to-tl from-white/60 to-transparent rounded-tl-full -mr-10 -mb-10 group-hover:scale-110 transition-transform duration-700" />
          </div>

          <div className="bg-linear-to-br from-[#fff7ed] to-[#ffedd5] p-10 rounded-[2rem] h-80 flex flex-col relative overflow-hidden group hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-smooth">
            <h3 className="font-heading2 text-text-main relative z-10">
              쉬운 캠페인 세팅
            </h3>
            <p className="font-body1 text-text-sub mt-2 relative z-10">
              복잡한 설정 없이
              <br />
              마우스 조작만으로 완성
            </p>
            <div className="absolute right-0 bottom-0 w-64 h-64 bg-linear-to-tl from-white/60 to-transparent rounded-tl-full -mr-10 -mb-10 group-hover:scale-110 transition-transform duration-700" />
          </div>

          <div className="bg-linear-to-br from-[#eff6ff] to-logo-1/20 p-10 rounded-[2rem] h-80 flex flex-col relative overflow-hidden group hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-smooth">
            <h3 className="font-heading2 text-text-main relative z-10">
              어디서든 함께
            </h3>
            <p className="font-body1 text-text-sub mt-2 relative z-10">
              스마트폰부터 대형 디스플레이까지
              <br />
              완벽하게 지원
            </p>
            <div className="absolute right-0 bottom-0 w-64 h-64 bg-linear-to-tl from-white/60 to-transparent rounded-tl-full -mr-10 -mb-10 group-hover:scale-110 transition-transform duration-700" />
          </div>
        </div>
      </div>
    </section>
  );
}
