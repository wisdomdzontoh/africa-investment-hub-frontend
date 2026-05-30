import {
  Activity,
  FileSearch,
  Scale,
  ShieldCheck,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import { BrandedCard } from "@/components/brand/Card";
import { SectionHead } from "@/components/common/SectionHead";

const ITEMS: { key: string; icon: LucideIcon }[] = [
  { key: "verified", icon: ShieldCheck },
  { key: "legal", icon: Scale },
  { key: "diligence", icon: FileSearch },
  { key: "ai", icon: Sparkles },
  { key: "monitoring", icon: Activity },
  { key: "matchmaking", icon: Users },
];

export async function PlatformBenefits() {
  const t = await getTranslations("home.platformBenefits");

  return (
    <section className="page py-14">
      <SectionHead eyebrow={t("eyebrow")} title={t("title")} sub={t("lead")} />
      <div className="benefit-grid mt-8">
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
    </section>
  );
}
