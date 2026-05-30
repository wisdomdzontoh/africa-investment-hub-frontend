"use client";

import {
  BookOpen,
  HelpCircle,
  Lightbulb,
  Route,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { BrandedButton } from "@/components/brand/Button";
import { BrandedCard } from "@/components/brand/Card";

const FUNCTIONS: { key: string; icon: LucideIcon }[] = [
  { key: "faqs", icon: HelpCircle },
  { key: "recommend", icon: Lightbulb },
  { key: "regulations", icon: BookOpen },
  { key: "onboarding", icon: Route },
];

function openChat() {
  window.dispatchEvent(new CustomEvent("aih:open-chat"));
}

export function AiAssistantSection() {
  const t = useTranslations("home.aiAssistant");

  return (
    <section className="page py-14 pb-6">
      <div className="ai-assistant-band">
        <div className="ai-assistant-copy">
          <div className="eyebrow">{t("eyebrow")}</div>
          <h2 className="h1 mt-3 flex items-center gap-2.5">
            <span className="ai-assistant-badge" aria-hidden>
              <Sparkles size={22} />
            </span>
            {t("title")}
          </h2>
          <p className="lead mt-3.5 max-w-[460px]">{t("lead")}</p>
          <BrandedButton className="mt-6" size="lg" onClick={openChat}>
            {t("cta")}
          </BrandedButton>
        </div>
        <div className="ai-assistant-grid">
          {FUNCTIONS.map(({ key, icon: Icon }) => (
            <BrandedCard key={key} pad className="benefit-card">
              <span className="benefit-ic">
                <Icon size={20} aria-hidden />
              </span>
              <h3 className="h4 mt-3">{t(`functions.${key}.title`)}</h3>
              <p className="m-0 mt-1.5 text-[var(--text-sm)] text-[var(--text-muted)]">
                {t(`functions.${key}.desc`)}
              </p>
            </BrandedCard>
          ))}
        </div>
      </div>
    </section>
  );
}
