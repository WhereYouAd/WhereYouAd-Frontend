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

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-brand-200 text-text-main flex flex-col">
      <LandingHeader />

      <main className="flex-1 flex flex-col">
        <LandingHero />
        <Suspense fallback={<div className="h-24" />}>
          <LandingFeatures />
          <LandingGuide />
          <LandingPricing />
          <LandingFAQ />
        </Suspense>
      </main>

      <LandingBrandIdentity />
      <LandingFooter />
    </div>
  );
}
