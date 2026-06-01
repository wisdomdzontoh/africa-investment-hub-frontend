import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { BrandedButton } from "@/components/brand/Button";

function ArcMotifLight() {
  const stroke = "rgba(255,255,255,0.16)";
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

export async function CtaBand() {
  const t = await getTranslations("home.cta");

  return (
    <section className="page pt-10">
      <div className="cta-band">
        <ArcMotifLight />
        <div className="relative">
          <h2 className="h1 max-w-[520px] text-white">{t("title")}</h2>
          <p className="mt-2.5 max-w-[460px] text-white/82">{t("sub")}</p>
        </div>
        <div className="relative flex flex-wrap gap-3">
          <BrandedButton
            asChild
            size="lg"
            className="bg-[var(--red-600)] text-white hover:bg-[var(--red-700)]"
          >
            <Link href="/sign-up">{t("register")}</Link>
          </BrandedButton>
          <BrandedButton
            asChild
            size="lg"
            variant="outline"
            className="border-white/40 bg-transparent text-white hover:bg-white/10"
          >
            <Link href="/opportunities">{t("browse")}</Link>
          </BrandedButton>
        </div>
      </div>
    </section>
  );
}
