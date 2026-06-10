"use client";

import { useTranslations } from "next-intl";
import { Button, SectionLabel } from "@/components/ds";
import { ContinentMapPanel } from "@/features/home/ContinentMapPanel";
import { HeroBackdrop } from "@/features/home/HeroBackdrop";

export function HeroSection() {
  const t = useTranslations("home.hero");

  return (
    <section className="bg-[var(--bg-page)]">
      {/* Animated photographic band, cream-veiled for legibility */}
      <div className="relative isolate overflow-hidden">
        <HeroBackdrop />
        <div className="page relative z-10 mx-auto max-w-[900px] py-[clamp(3.5rem,9vw,7rem)] text-center">
          <div className="mb-[26px]">
            <SectionLabel dot>{t("eyebrow")}</SectionLabel>
          </div>
          <h1 className="text-balance text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[1.1] tracking-[-0.02em] text-[var(--ink)]">
            {t("title")}
          </h1>
          <p className="mx-auto mt-6 max-w-[620px] text-lg leading-relaxed text-[var(--text-body)]">
            {t("lead")}
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
            <Button href="/sign-up" size="lg">
              {t("registerCta")}
            </Button>
            <Button href="/opportunities" size="lg" variant="outline">
              {t("exploreCta")}
            </Button>
          </div>
          <p className="mt-7 font-mono text-xs font-medium uppercase tracking-[0.08em] text-[var(--text-muted)]">
            {t("trustLine")}
          </p>
        </div>
      </div>

      <ContinentMapPanel />
    </section>
  );
}
