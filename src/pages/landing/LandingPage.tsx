import type { CSSProperties } from "react";
import { lazy, Suspense } from "react";

import LandingBrandIdentity from "@/components/landing/LandingBrandIdentity";
import LandingFooter from "@/components/landing/LandingFooter";
import LandingHeader from "@/components/landing/LandingHeader";
import LandingHero from "@/components/landing/LandingHero";

const LandingFeatures = lazy(
  () => import("@/components/landing/LandingFeatures"),
);
const LandingGuide = lazy(() => import("@/components/landing/LandingGuide"));
const LandingPricing = lazy(
  () => import("@/components/landing/LandingPricing"),
);
const LandingFAQ = lazy(() => import("@/components/landing/LandingFAQ"));

function SectionFallback({ height = 96 }: { height?: number }) {
  return <div className="w-full" style={{ height }} aria-hidden />;
}

export default function LandingPage() {
  return (
    <div
      className="min-h-screen bg-brand-200 text-text-main flex flex-col"
      style={
        {
          ["--landing-header-height" as never]: "72px",
        } as CSSProperties
      }
    >
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

      <LandingBrandIdentity />
      <LandingFooter />
    </div>
  );
}
