import {
  Building2,
  Cpu,
  Gem,
  Globe2,
  Handshake,
  Users,
  type LucideIcon,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import { BrandedCard } from "@/components/brand/Card";

const ITEMS: { key: string; icon: LucideIcon }[] = [
  { key: "population", icon: Users },
  { key: "markets", icon: Globe2 },
  { key: "resources", icon: Gem },
  { key: "afcfta", icon: Handshake },
  { key: "urbanization", icon: Building2 },
  { key: "digital", icon: Cpu },
];

export async function WhyAfrica() {
  const t = await getTranslations("home.whyAfrica");

  return (
    <section className="why-band">
      <div className="page py-16">
        <h2 className="h1 max-w-[520px]">{t("title")}</h2>
        <p className="lead mt-3.5 max-w-[560px]">{t("lead")}</p>
        <div className="benefit-grid mt-10">
          {ITEMS.map(({ key, icon: Icon }) => (
            <BrandedCard key={key} pad className="benefit-card">
              <span className="benefit-ic">
                <Icon size={20} aria-hidden />
              </span>
              <h3 className="h4 mt-3">{t(`items.${key}.title`)}</h3>
              <p className="m-0 mt-1.5 text-[var(--text-sm)] text-[var(--text-muted)]">
                {t(`items.${key}.desc`)}
              </p>
            </BrandedCard>
          ))}
        </div>
      </div>
    </section>
  );
}
