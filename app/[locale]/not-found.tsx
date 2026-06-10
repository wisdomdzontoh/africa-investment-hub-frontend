import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ds/Button";

export default async function NotFound() {
  const [t, tn] = await Promise.all([
    getTranslations("notFound"),
    getTranslations("nav"),
  ]);

  return (
    <section className="relative isolate flex min-h-[80vh] items-center overflow-hidden bg-[var(--bg-page)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-[clamp(180px,38%,460px)] opacity-60 [mask-image:linear-gradient(to_left,black,transparent)] bg-[repeating-linear-gradient(45deg,var(--bg-page),var(--bg-page)_11px,var(--bg-stripe)_11px,var(--bg-stripe)_22px)]"
      />
      <div className="page relative z-10 py-20 text-center">
        <p className="font-mono text-[clamp(4rem,12vw,8rem)] font-bold leading-none tracking-[-0.04em] text-[var(--accent)]">
          404
        </p>
        <h1 className="mt-4 text-balance text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold leading-[1.12] tracking-[-0.02em] text-[var(--ink)]">
          {t("title")}
        </h1>
        <p className="mx-auto mt-4 max-w-md text-[var(--text-lead-size)] leading-relaxed text-[var(--text-body)]">
          {t("body")}
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
          <Link href="/" className={buttonVariants({ size: "lg" })}>
            {t("home")}
          </Link>
          <Link
            href="/opportunities"
            className={buttonVariants({ size: "lg", variant: "outline" })}
          >
            {tn("opportunities")}
          </Link>
        </div>
      </div>
    </section>
  );
}
