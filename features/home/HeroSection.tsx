import { Building2, Landmark } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ds";
import { Link } from "@/i18n/navigation";
import { HeroAccessForm } from "@/features/home/HeroAccessForm";
import { HeroBackdrop } from "@/features/home/HeroBackdrop";
import { HeroFloatingGraph } from "@/features/home/HeroFloatingGraph";

export async function HeroSection() {
  const t = await getTranslations("home.hero");

  return (
    <section className="relative overflow-hidden bg-[var(--bg-page)]">
      <HeroBackdrop />
      <HeroFloatingGraph />

      <div className="page relative z-10 py-[clamp(2.5rem,6vw,4rem)] text-center">
        <h1 className="mx-auto max-w-[90rem] text-[clamp(3rem,2.58rem+1.85vw,4.25rem)] font-bold leading-[1.05] tracking-[-0.03em]">
          <span className="block text-[var(--ink)]">{t("headline.line1")}</span>
          <span className="block text-[var(--accent)]">{t("headline.line2")}</span>
        </h1>

        <div className="mx-auto mt-6 max-w-[44rem]">
          <p className="text-balance text-lg leading-relaxed text-[var(--text-body)]">
            {t("lead")}
          </p>
          <p className="mt-2.5 text-sm text-[var(--text-muted)]">{t("tertiary")}</p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="/sign-up?role=investor" variant="outline" size="lg" className="flex-1 gap-2">
              <Landmark size={18} aria-hidden />
              {t("ctaInvestor")}
            </Button>
            <Button href="/sign-up?role=facilitator" variant="outline" size="lg" className="flex-1 gap-2">
              <Building2 size={18} aria-hidden />
              {t("ctaProject")}
            </Button>
          </div>

          <div className="relative my-5 flex items-center justify-center">
            <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-[var(--ink-border)]" />
            <span className="relative bg-[var(--bg-page)] px-3 font-mono text-xs uppercase tracking-[0.08em] text-[var(--text-muted)]">
              {t("orDivider")}
            </span>
          </div>

          <HeroAccessForm />

          <p className="mt-4 text-xs leading-relaxed text-[var(--text-muted)]">
            {t.rich("legal", {
              terms: (chunks) => (
                <Link href="/terms" className="underline hover:text-[var(--accent)]">
                  {chunks}
                </Link>
              ),
              privacy: (chunks) => (
                <Link href="/privacy" className="underline hover:text-[var(--accent)]">
                  {chunks}
                </Link>
              ),
            })}
          </p>

          <div className="mt-4 flex items-center justify-center gap-6">
            <Link
              href="/opportunities"
              className="text-sm font-medium text-[var(--text-muted)] no-underline transition-colors hover:text-[var(--accent)]"
            >
              {t("exploreLink")}
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-[var(--text-muted)] no-underline transition-colors hover:text-[var(--accent)]"
            >
              {t("advisorLink")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
