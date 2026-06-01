"use client";

import {
  ArrowRight,
  Compass,
  ShieldCheck,
  UserPlus,
  type LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { BrandedBadge } from "@/components/brand/Badge";
import { BrandedButton } from "@/components/brand/Button";
import { BrandedCard } from "@/components/brand/Card";
import { HeroBackgroundSlider } from "@/features/home/HeroBackgroundSlider";
import { Flag } from "@/components/common/Flag";
import { RiskBadge } from "@/components/common/RiskBadge";
import { SectorGlyph } from "@/components/common/SectorGlyph";
import { KpiValue } from "@/components/common/SectionHead";
import { fmtMoney } from "@/lib/format";
import { getHomeKpi } from "@/lib/data/home";
import { TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

function ArcMotif() {
  const stroke = "color-mix(in srgb, var(--red-600) 12%, transparent)";
  return (
    <svg className="arc-motif" viewBox="0 0 600 600" aria-hidden="true">
      {[60, 130, 200, 270, 340, 410, 480].map((r) => (
        <circle
          key={r}
          cx="600"
          cy="300"
          r={r}
          fill="none"
          stroke={stroke}
          strokeWidth="1.5"
        />
      ))}
    </svg>
  );
}

function TrustStrip() {
  const t = useTranslations("home.hero.trust");
  const items: { icon: LucideIcon; text: string }[] = [
    { icon: ShieldCheck, text: t("investors") },
    { icon: ShieldCheck, text: t("projects") },
    { icon: Compass, text: t("countries") },
  ];

  return (
    <div className="trust-strip">
      {items.map(({ icon: Icon, text }) => (
        <span key={text}>
          <Icon size={15} style={{ color: "var(--teal-600)" }} aria-hidden />
          {text}
        </span>
      ))}
    </div>
  );
}

function HeroPreview() {
  const t = useTranslations("home.hero");
  const [kpi, setKpi] = useState({ capitalFacilitated: "$214M", dealsClosed: 31 });

  useEffect(() => {
    getHomeKpi().then(setKpi);
  }, []);

  return (
    <div className="hero-preview">
      <Link href="/opportunities">
        <BrandedCard hover className="hero-pc w-[320px] max-w-full">
          <div className="flex items-start justify-between px-4 pt-4">
            <SectorGlyph id="renewable" size={40} />
            <BrandedBadge tone="featured" icon="star">
              Featured
            </BrandedBadge>
          </div>
          <div className="px-4 pt-3">
            <div className="mb-1.5 flex items-center gap-1.5">
              <Flag code="ke" />
              <span className="text-[var(--text-xs)] font-semibold text-[var(--text-muted)]">
                Kenya
              </span>
            </div>
            <h4 className="h4">Rift Valley Solar + Storage</h4>
          </div>
          <div className="proj-stats mt-3.5">
            <div>
              <div className="label-caps">{t("capitalFacilitated")}</div>
              <div className="proj-stat-v font-mono">{fmtMoney(26500000)}</div>
            </div>
            <div>
              <div className="label-caps">ROI</div>
              <div className="proj-stat-v font-mono">11–15%</div>
            </div>
            <div>
              <div className="label-caps">Risk</div>
              <div className="mt-0.5">
                <RiskBadge level="low" />
              </div>
            </div>
          </div>
        </BrandedCard>
      </Link>

      <BrandedCard pad className="hero-stat-tile">
        <div className="label-caps">{t("capitalFacilitated")}</div>
        <KpiValue className="mt-1.5 text-[30px]">{kpi.capitalFacilitated}</KpiValue>
        <div className="mt-1 flex items-center gap-1 text-[var(--text-xs)] font-semibold text-[var(--success)]">
          <TrendingUp size={13} aria-hidden />
          {t("dealsClosed", { count: kpi.dealsClosed })}
        </div>
      </BrandedCard>

      <div className="hero-flags">
        {["ng", "za", "gh", "et", "ma", "rw"].map((c) => (
          <Flag key={c} code={c} lg />
        ))}
        <span className="hero-flags-more">{t("moreCountries")}</span>
      </div>
    </div>
  );
}

export function HeroEditorial() {
  const t = useTranslations("home.hero");

  return (
    <section className="hero-editorial">
      <HeroBackgroundSlider />
      <div className="hero-bg-veil" aria-hidden="true" />
      <ArcMotif />
      <div className="hero-inner">
        <div>
          <div className="eyebrow">{t("eyebrow")}</div>
          <h1 className="display-2 mt-3.5">
            {t.rich("title", {
              verified: (chunks) => (
                <span style={{ color: "var(--red-600)" }}>{chunks}</span>
              ),
            })}
          </h1>
          <p className="lead mt-4 max-w-[480px] text-[var(--text-md)]">
            {t("lead")}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <BrandedButton asChild size="lg">
              <Link href="/opportunities" className="inline-flex items-center gap-2">
                {t("exploreCta")}
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </BrandedButton>
            <BrandedButton asChild variant="secondary" size="lg">
              <Link href="/sign-up">{t("registerCta")}</Link>
            </BrandedButton>
            <BrandedButton asChild variant="secondary" size="lg">
              <Link href="/sign-up">{t("submitProjectCta")}</Link>
            </BrandedButton>
            <BrandedButton asChild variant="outline" size="lg">
              <Link href="/contact">{t("advisorCta")}</Link>
            </BrandedButton>
          </div>
          <div className="mt-7">
            <TrustStrip />
          </div>
        </div>
        <div className="hero-visual">
          <HeroPreview />
        </div>
      </div>
    </section>
  );
}

export function ProcessStrip() {
  const t = useTranslations("home.process");
  const steps = [
    { icon: UserPlus, title: t("register.title"), desc: t("register.desc") },
    { icon: ShieldCheck, title: t("verify.title"), desc: t("verify.desc") },
    { icon: Compass, title: t("invest.title"), desc: t("invest.desc") },
  ];

  return (
    <section className="page py-14 pb-2">
      <div className="process-grid">
        {steps.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={s.title} className="process-step">
              <span className="process-num">{i + 1}</span>
              <span className="process-ic">
                <Icon size={22} aria-hidden />
              </span>
              <h3 className="h4 mt-1">{s.title}</h3>
              <p className="m-0 text-[var(--text-sm)] text-[var(--text-muted)]">
                {s.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
