import { lazy, Suspense } from "react";

import LandingFooter from "@/components/landing/LandingFooter";
import LandingHeader from "@/components/landing/LandingHeader";
import LandingHero from "@/components/landing/LandingHero";
import LandingMultiDevice from "@/components/landing/LandingMultiDevice";

const LandingFeatures = lazy(
  () => import("@/components/landing/LandingFeatures"),
);
const LandingGuide = lazy(() => import("@/components/landing/LandingGuide"));
const LandingPricing = lazy(
  () => import("@/components/landing/LandingPricing"),
);
const LandingFAQ = lazy(() => import("@/components/landing/LandingFAQ"));

function SectionFallback({ height = 96 }: { height?: number }) {
  return (
    <div className="w-full" style={{ height }} aria-hidden>
      <div className="h-full w-full rounded-[28px] border border-surface-400/60 bg-surface-100/55 backdrop-blur-sm shadow-card overflow-hidden">
        <div className="h-full w-full animate-pulse bg-gradient-to-r from-primary-100/40 via-surface-100/40 to-primary-100/40" />
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface-100 text-text-auth-sub flex flex-col [--landing-header-height:64px] md:[--landing-header-height:72px]">
      <LandingHeader />

      <main className="flex-1 flex flex-col">
        <LandingHero />
        <Suspense fallback={<SectionFallback height={180} />}>
          <LandingFeatures />
        </Suspense>
        <Suspense fallback={<SectionFallback height={220} />}>
          <LandingGuide />
        </Suspense>
        <Suspense fallback={<SectionFallback height={200} />}>
          <LandingPricing />
        </Suspense>
        <Suspense fallback={<SectionFallback height={220} />}>
          <LandingFAQ />
        </Suspense>
      </main>

      <LandingMultiDevice />
      <LandingFooter />
    </div>
  );
}
