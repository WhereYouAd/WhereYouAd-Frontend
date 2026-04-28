import LandingFAQ from "@/components/landing/LandingFAQ";
import LandingFeatures from "@/components/landing/LandingFeatures";
import LandingFooter from "@/components/landing/LandingFooter";
import LandingGuide from "@/components/landing/LandingGuide";
import LandingHeader from "@/components/landing/LandingHeader";
import LandingHero from "@/components/landing/LandingHero";
import LandingPricing from "@/components/landing/LandingPricing";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-brand-200 text-text-main flex flex-col">
      <LandingHeader />

      <main className="flex-1 flex flex-col">
        <LandingHero />
        <LandingFeatures />
        <LandingGuide />
        <LandingPricing />
        <LandingFAQ />
      </main>

      <LandingFooter />
    </div>
  );
}
