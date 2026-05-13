export default function LandingFooter() {
  return (
    <footer className="bg-surface-200 text-text-title py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-10">
          <div className="flex flex-col items-center md:items-start gap-6">
            <div className="text-sm text-text-auth-sub text-center md:text-left leading-relaxed">
              <p>Where You Ad</p>
            </div>
          </div>
          <div className="flex items-center gap-8 font-body2 text-surface-500">
            <a
              href="https://www.notion.so/Where-you-ad-351085b3a16c8040b7bef7ac311da984?source=copy_link"
              target="_blank"
              rel="noreferrer"
              className="hover:text-primary-500 transition-colors rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400/35 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-200"
            >
              이용약관
            </a>
            <a
              href="https://www.notion.so/Where-you-ad-351085b3a16c80c3b171f97238e447ca?source=copy_link"
              target="_blank"
              rel="noreferrer"
              className="hover:text-primary-500 transition-colors rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400/35 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-200"
            >
              개인정보처리방침
            </a>
            <a
              href="mailto:whereyouadofficial@gmail.com"
              className="hover:text-primary-500 transition-colors rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400/35 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-200"
            >
              고객센터
            </a>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-surface-400/90 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-caption text-text-muted">
            © 2026 WhereYouAd. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
