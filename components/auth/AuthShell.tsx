import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { AfriVestLogo } from "@/components/brand/AfriVestLogo";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { Link } from "@/i18n/navigation";

type AuthShellProps = {
  children: React.ReactNode;
  /** One or two centred headline lines. Two lines render as two separate
   *  blocks (no manual <br/> in the translation string). */
  headline: string | [string, string];
  supporting: string;
  illustration: "sign-in" | "sign-up";
  /** Set false to drop the headline from the visible left panel entirely —
   *  it still exists as a screen-reader-only <h1> so the page keeps an
   *  accessible title even with no visible marketing copy. */
  showHeadline?: boolean;
};

// These are static SVG exports, not Lottie's .lottie/.json format, so
// DotLottieReact (installed per request, ready for real Lottie sources later)
// can't play them frame-by-frame — see the fade-in <Image> below for the
// CSS-driven stand-in and the note on swapping in real .lottie files.
const ILLUSTRATION_SRC: Record<AuthShellProps["illustration"], string> = {
  "sign-in": "/auth/Login.svg",
  "sign-up": "/auth/signp.svg",
};

function Headline({ lines, supporting, className }: { lines: string[]; supporting: string; className?: string }) {
  return (
    <div className={className}>
      <h1 className="text-balance text-[clamp(1.375rem,1.1rem+1.2vw,1.875rem)] font-bold leading-[1.15] tracking-[-0.02em] text-[var(--ink)]">
        {lines.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </h1>
      <p className="mt-1.5 text-sm text-[var(--text-body)]">{supporting}</p>
    </div>
  );
}

/**
 * Shared shell for sign-in/sign-up: a split screen with an illustrated panel
 * on the left (a light tint step off the page background — not a hard visual
 * break) and the form column on the right. The headline lives only on the
 * left panel alongside the illustration and disclaimer — the right side is
 * the form and nothing else, so it stays as compact as possible. Below the
 * split-screen breakpoint the left panel (illustration included) drops out
 * entirely and a compact version of the same headline moves above the form,
 * so every screen still has exactly one accessible <h1>.
 */
export async function AuthShell({
  children,
  headline,
  supporting,
  illustration,
  showHeadline = true,
}: AuthShellProps) {
  const t = await getTranslations("auth");
  const lines = Array.isArray(headline) ? headline : [headline];

  return (
    <div className="flex min-h-screen lg:h-screen lg:overflow-hidden">
      <div className="relative hidden shrink-0 flex-col overflow-hidden bg-[var(--bg-section)] p-6 lg:flex lg:w-[42%] lg:p-8 xl:w-[38%]">
        <Link href="/" className="inline-flex w-fit items-center no-underline" aria-label="AfriVest home">
          <AfriVestLogo height={24} />
        </Link>

        {showHeadline ? (
          <Headline lines={lines} supporting={supporting} className="mt-8 max-w-[380px]" />
        ) : (
          <span className="sr-only">
            <Headline lines={lines} supporting={supporting} />
          </span>
        )}

        <div className="flex flex-1 items-center justify-center py-2">
          <Image
            src={ILLUSTRATION_SRC[illustration]}
            alt=""
            aria-hidden
            width={400}
            height={400}
            priority
            className="fade-in h-auto w-full max-w-[320px] xl:max-w-[360px]"
            style={{ animationDuration: "700ms" }}
          />
        </div>

        <p className="text-xs leading-relaxed text-[var(--text-muted)]">{t("disclaimer")}</p>
      </div>

      <div className="flex flex-1 flex-col overflow-y-auto bg-[var(--bg-page)]">
        <div className="flex items-center justify-between p-5 lg:hidden">
          <Link href="/" className="inline-flex items-center no-underline" aria-label="AfriVest home">
            <AfriVestLogo height={22} />
          </Link>
        </div>

        <main className="flex flex-1 items-center justify-center px-5 py-4">
          <div className="w-full max-w-[400px]">
            {/* Visually the headline only lives on the left panel — below
                lg that panel is gone, so this keeps one accessible <h1> on
                the page for screen readers without showing anything. */}
            <Headline lines={lines} supporting={supporting} className="sr-only lg:hidden" />

            <div className="text-left">{children}</div>
          </div>
        </main>

        <footer className="flex items-center justify-center gap-4 p-3">
          <LanguageSwitcher />
          <Link
            href="/terms"
            className="text-xs font-medium text-[var(--text-muted)] no-underline transition-colors hover:text-[var(--accent)]"
          >
            {t("footerTerms")}
          </Link>
        </footer>
      </div>
    </div>
  );
}
