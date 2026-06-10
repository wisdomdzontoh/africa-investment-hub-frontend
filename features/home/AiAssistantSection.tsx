"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Button, Card, SectionLabel } from "@/components/ds";

const FUNCTIONS = ["faqs", "recommend", "regulations", "onboarding"] as const;

const ICONS: Record<(typeof FUNCTIONS)[number], string> = {
  faqs: "search",
  recommend: "trend",
  regulations: "layers",
  onboarding: "checklist",
};

function openChat() {
  window.dispatchEvent(new CustomEvent("aih:open-chat"));
}

function IconWell({ name }: { name: string }) {
  return (
    <div className="mb-3 flex size-11 items-center justify-center rounded-[10px] bg-[color-mix(in_srgb,var(--on-dark)_12%,transparent)]">
      <Image src={`/brand/icons/${name}.svg`} width={22} height={22} alt="" aria-hidden />
    </div>
  );
}

export function AiAssistantSection() {
  const t = useTranslations("home.aiAssistant");

  return (
    <section className="bg-[var(--bg-page)] py-[clamp(3rem,7vw,7.5rem)]">
      <div className="page">
        <div className="overflow-hidden rounded-[var(--radius-panel)] bg-[var(--surface-dark)] p-8 sm:p-12 lg:p-14">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-start">
            <div>
              <SectionLabel onDark>{t("eyebrow")}</SectionLabel>
              <h2 className="mt-3 text-balance text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold leading-[1.15] tracking-[-0.02em] text-[var(--on-dark)]">
                {t("title")}
              </h2>
              <p className="mt-3.5 max-w-[460px] text-[var(--on-dark-65)]">
                {t("lead")}
              </p>
              <Button className="mt-6" size="lg" onClick={openChat}>
                {t("cta")}
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {FUNCTIONS.map((key) => (
                <Card
                  key={key}
                  variant="dark"
                  hoverLift={false}
                  padding="24px"
                  className="border border-[var(--on-dark-divider)]"
                >
                  <IconWell name={ICONS[key]} />
                  <h3 className="text-base font-semibold text-[var(--on-dark)]">
                    {t(`functions.${key}.title`)}
                  </h3>
                  <p className="m-0 mt-2 text-sm leading-relaxed text-[var(--on-dark-65)]">
                    {t(`functions.${key}.desc`)}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
