export default function LandingFooter() {
  return (
    <footer className="bg-footer-bg text-text-disabled py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-10">
          <div className="flex flex-col items-center md:items-start gap-6">
            <div className="text-sm text-text-disabled text-center md:text-left leading-relaxed">
              <p>Where You Ad</p>
            </div>
          </div>
          <div className="flex items-center gap-8 font-body2">
            <span className="text-text-disabled/70 select-none">이용약관</span>
            <span className="text-text-disabled/70 select-none">
              개인정보처리방침
            </span>
            <a
              href="mailto:whereyouadofficial@gmail.com"
              className="hover:text-white transition-colors"
            >
              고객센터
            </a>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-footer-border text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-caption text-text-disabled">
            © 2026 WhereYouAd. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
