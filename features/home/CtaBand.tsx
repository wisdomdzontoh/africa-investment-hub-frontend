import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ds";

export async function CtaBand() {
  const t = await getTranslations("home.finalCta");

  return (
    <section className="relative isolate overflow-hidden border-t border-[var(--on-dark-divider)] bg-[var(--surface-dark)] px-[clamp(1rem,4vw,2.5rem)] py-[clamp(3.5rem,8vw,7.5rem)]">
      {/* Graph-paper grid + a soft accent glow behind the headline — the glow
          reuses the exact radial-gradient PageHero's dark tone already uses,
          just paired with a grid texture instead of standing alone. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, color-mix(in srgb, var(--on-dark) 14%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in srgb, var(--on-dark) 14%, transparent) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage: "radial-gradient(ellipse 90% 100% at 50% 40%, black 55%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 90% 100% at 50% 40%, black 55%, transparent 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-[-40px]"
        style={{
          background:
            "radial-gradient(circle at 50% 30%, color-mix(in srgb, var(--accent) 24%, transparent) 0%, transparent 60%)",
        }}
      />

      <div className="page relative z-10 mx-auto max-w-[800px] text-center">
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
