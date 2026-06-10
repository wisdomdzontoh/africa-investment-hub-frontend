import { ArrowLeft, Check } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/brand/Logo";

/**
 * Branded split-screen frame for the Clerk auth widgets. Left: a cream brand
 * panel with the DS 45° stripe motif, headline and verification value points.
 * Right: the auth form on the page surface. Collapses to a single column on
 * mobile (brand panel hidden, compact logo above the form).
 */
export async function AuthShell({ children }: { children: React.ReactNode }) {
  const t = await getTranslations("auth");
  const points = [t("point1"), t("point2"), t("point3")];

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden border-r border-[var(--accent-border)] bg-[var(--bg-section)] p-12 lg:flex lg:flex-col lg:justify-between">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-[42%] opacity-60 [mask-image:linear-gradient(to_left,black,transparent)] bg-[repeating-linear-gradient(45deg,var(--bg-section),var(--bg-section)_11px,var(--bg-stripe)_11px,var(--bg-stripe)_22px)]"
        />
        <Link href="/" className="relative z-10 inline-flex" aria-label="African Investment Hub home">
          <Logo className="logo-image-header" />
        </Link>

        <div className="relative z-10 max-w-[440px]">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.08em] text-[var(--accent)]">
            {t("eyebrow")}
          </p>
          <h2 className="mt-4 text-balance text-[clamp(1.75rem,2.6vw,2.5rem)] font-bold leading-[1.15] tracking-[-0.02em] text-[var(--ink)]">
            {t("headline")}
          </h2>
          <ul className="mt-8 space-y-4">
            {points.map((p) => (
              <li key={p} className="flex items-start gap-3">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-white">
                  <Check size={14} strokeWidth={3} aria-hidden />
                </span>
                <span className="text-[15px] leading-relaxed text-[var(--text-body)]">
                  {p}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative z-10 font-mono text-[var(--text-meta-size)] uppercase tracking-[0.06em] text-[var(--text-muted)]">
          {t("disclaimer")}
        </p>
      </aside>

      <main className="flex flex-col items-center justify-center bg-[var(--bg-page)] px-6 py-12 sm:px-10">
        <div className="flex w-full max-w-[440px] flex-col items-center">
          <Link href="/" className="mb-8 inline-flex lg:hidden" aria-label="African Investment Hub home">
            <Logo height={38} />
          </Link>

          {children}

          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-2 font-mono text-[13px] font-semibold text-[var(--text-muted)] no-underline transition-colors hover:text-[var(--accent)]"
          >
            <ArrowLeft size={15} aria-hidden />
            {t("backHome")}
          </Link>
        </div>
      </main>
    </div>
  );
}
