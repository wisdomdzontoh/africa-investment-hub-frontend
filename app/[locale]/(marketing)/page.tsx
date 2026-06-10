import { setRequestLocale } from "next-intl/server";
import { HeroSection } from "@/features/home/HeroSection";
import { ProblemSection } from "@/features/home/ProblemSection";
import { FeatureTabsSection } from "@/features/home/FeatureTabsSection";
import { ProcessStrip } from "@/features/home/ProcessStrip";
import { ImpactBand } from "@/features/home/ImpactBand";
import { FeaturedSection } from "@/features/home/FeaturedSection";
import { WhyAfrica } from "@/features/home/WhyAfrica";
import { PlatformBenefits } from "@/features/home/PlatformBenefits";
import { SectorsSection } from "@/features/home/SectorsSection";
import { AiAssistantSection } from "@/features/home/AiAssistantSection";
import { CountryPreview } from "@/features/home/CountryPreview";
import { CtaBand } from "@/features/home/CtaBand";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div style={{ background: "var(--surface-page)" }}>
      <HeroSection />
      <ProblemSection />
      <FeatureTabsSection />
      <ProcessStrip />
      <ImpactBand />
      <FeaturedSection />
      <WhyAfrica />
      <PlatformBenefits />
      <SectorsSection />
      <AiAssistantSection />
      <CountryPreview />
      <CtaBand />
    </div>
  );
}
