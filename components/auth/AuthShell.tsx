import { ArrowLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/brand/Logo";

type AuthShellProps = {
  children: React.ReactNode;
  mode: "sign-in" | "sign-up";
};

/**
 * Branded split-screen frame for Clerk auth widgets. Full warm-dark canvas with
 * a subtle dot grid; left hero carries the brand headline; right column floats
 * a white card with logo, lead copy, and the form. Collapses to a single column
 * on mobile (hero hidden, card centered on the dark surface).
 */
export async function AuthShell({ children, mode }: AuthShellProps) {
  const t = await getTranslations("auth");
  const cardSubtitle =
    mode === "sign-in" ? t("cardSubtitleSignIn") : t("cardSubtitleSignUp");

  return (
    <div className="relative grid min-h-screen lg:grid-cols-[3fr_2fr]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[color-mix(in_srgb,var(--accent)_26%,var(--surface-dark))]"
        style={{
          backgroundImage:
            "radial-gradient(circle at center, color-mix(in srgb, var(--on-dark) 11%, transparent) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_42%,color-mix(in_srgb,var(--accent)_22%,transparent)_0%,transparent_52%)]"
      />

      <aside className="relative hidden flex-col justify-center px-12 py-12 xl:px-16 xl:py-14 lg:flex">
        <div className="max-w-[520px]">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.08em] text-[var(--on-dark-50)]">
            {t("eyebrow")}
          </p>
          <h1 className="mt-5 text-balance text-[clamp(2rem,3.4vw,3.25rem)] font-bold leading-[1.12] tracking-[-0.02em] text-[var(--on-dark)]">
            {t("headline")}
          </h1>
        </div>
      </aside>

      <main className="relative flex items-center justify-center px-6 py-10 sm:px-10 sm:py-12">
        <div className="w-full max-w-[520px]">
          <div className="w-full rounded-[var(--radius-panel)] bg-[var(--surface-card)] px-8 py-9 shadow-[var(--shadow-dark-float)] sm:px-10 sm:py-10">
            <div className="mb-6 flex flex-col items-center text-center">
              <Link href="/" className="inline-flex" aria-label="African Investment Hub home">
                <Logo height={38} />
              </Link>
              <p className="mt-4 max-w-[380px] text-[15px] leading-relaxed text-[var(--text-muted)]">
                {cardSubtitle}
              </p>
            </div>

            <div className="auth-clerk">{children}</div>

            <div className="mt-8 border-t border-[var(--accent-border)] pt-6 text-center">
              <Link
                href="/"
                className="inline-flex items-center gap-2 font-mono text-[13px] font-semibold text-[var(--text-muted)] no-underline transition-colors hover:text-[var(--accent)]"
              >
                <ArrowLeft size={15} aria-hidden />
                {t("backHome")}
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
