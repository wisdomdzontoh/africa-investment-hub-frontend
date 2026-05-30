import { setRequestLocale } from "next-intl/server";
import { AiAssistantSection } from "@/features/home/AiAssistantSection";
import { HeroEditorial, ProcessStrip } from "@/features/home/HeroEditorial";
import { FeaturedSection } from "@/features/home/FeaturedSection";
import { PlatformBenefits } from "@/features/home/PlatformBenefits";
import { WhyAfrica } from "@/features/home/WhyAfrica";
import { SectorsSection } from "@/features/home/SectorsSection";
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
      <HeroEditorial />
      <ProcessStrip />
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
