import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ds";

export async function CtaBand() {
  const t = await getTranslations("home.finalCta");

  return (
    <section className="border-t border-[var(--on-dark-divider)] bg-[var(--surface-dark)] px-[clamp(1rem,4vw,2.5rem)] py-[clamp(3.5rem,8vw,7.5rem)]">
      <div className="page mx-auto max-w-[800px] text-center">
        <h2 className="text-balance text-[clamp(1.75rem,3.5vw,3rem)] font-bold leading-[1.15] tracking-[-0.02em] text-[var(--on-dark)]">
          {t("title")}
        </h2>
        <p className="mx-auto mt-5 max-w-[600px] text-[17px] leading-relaxed text-[var(--on-dark-65)]">
          {t("sub")}
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
          <Button href="/sign-up" size="lg">
            {t("register")}
          </Button>
          <Button href="/sign-up" size="lg" variant="onDark">
            {t("submitProject")}
          </Button>
        </div>
      </div>
    </section>
  );
}
