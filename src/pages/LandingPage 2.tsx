import { lazy, Suspense } from "react";

import HeroSection from "@/components/landing/HeroSection";
import LandingFooter from "@/components/landing/LandingFooter";
import LandingNav from "@/components/landing/LandingNav";

// 폴드 아래 섹션은 lazy load
const ProblemSection = lazy(
  () => import("@/components/landing/ProblemSection"),
);
const FeatureSection = lazy(
  () => import("@/components/landing/FeatureSection"),
);
const HowItWorksSection = lazy(
  () => import("@/components/landing/HowItWorksSection"),
);
const SocialProofSection = lazy(
  () => import("@/components/landing/SocialProofSection"),
);
const CTASection = lazy(() => import("@/components/landing/CTASection"));

function SectionFallback() {
  return (
    <div className="h-40 w-full animate-pulse rounded-xl bg-white/4 mx-auto max-w-5xl my-8" />
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <LandingNav />

      {/* Hero — 즉시 렌더 */}
      <HeroSection />

      {/* 폴드 아래 — lazy */}
      <Suspense fallback={<SectionFallback />}>
        <section id="problems">
          <ProblemSection />
        </section>
      </Suspense>

      <Suspense fallback={<SectionFallback />}>
        <section id="features">
          <FeatureSection />
        </section>
      </Suspense>

      <Suspense fallback={<SectionFallback />}>
        <section id="how-it-works">
          <HowItWorksSection />
        </section>
      </Suspense>

      <Suspense fallback={<SectionFallback />}>
        <SocialProofSection />
      </Suspense>

      <Suspense fallback={<SectionFallback />}>
        <CTASection />
      </Suspense>

      <LandingFooter />
    </div>
  );
}
