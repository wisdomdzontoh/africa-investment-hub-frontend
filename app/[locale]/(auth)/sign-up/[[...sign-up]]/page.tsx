import { SignUp } from "@clerk/nextjs";
import { Building2, Compass } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { AuthShell } from "@/components/auth/AuthShell";
import { HideExcludedProviders } from "@/components/auth/HideExcludedProviders";
import { Link } from "@/i18n/navigation";
import { clerkAppearance } from "@/lib/clerk/appearance";

type RoleIntent = "investor" | "facilitator";

function parseRole(value: string | string[] | undefined): RoleIntent | null {
  return value === "investor" || value === "facilitator" ? value : null;
}

function parseEmail(value: string | string[] | undefined): string | undefined {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw) ? raw : undefined;
}

/** Audience banner above the sign-up card when a CTA carried role intent
 *  (FE-08). The role is forwarded to onboarding to pre-seed the choice. */
async function RoleIntentBanner({ role }: { role: RoleIntent }) {
  const t = await getTranslations("auth");
  const Icon = role === "investor" ? Compass : Building2;
  const other: RoleIntent = role === "investor" ? "facilitator" : "investor";
  return (
    <div className="mb-3 w-full rounded-[var(--radius-md)] border border-[var(--accent-border)] bg-[var(--accent-tint-06)] p-3">
      <div className="flex items-start gap-2.5">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-[var(--radius-icon)] bg-[var(--accent-tint-10)] text-[var(--accent)]">
          <Icon size={15} aria-hidden />
        </span>
        <div>
          <p className="text-sm font-semibold text-[var(--ink)]">
            {t(role === "investor" ? "intentInvestorTitle" : "intentFacilitatorTitle")}
          </p>
          <Link
            href={`/sign-up?role=${other}`}
            className="mt-0.5 inline-block text-xs font-semibold text-[var(--accent)] no-underline hover:underline"
          >
            {t(role === "investor" ? "intentSwitchFacilitator" : "intentSwitchInvestor")}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default async function SignUpPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;
  const role = parseRole(resolvedSearchParams.role);
  const email = parseEmail(resolvedSearchParams.email);
  const t = await getTranslations("auth.signUp");

  return (
    <AuthShell
      headline={[t("headlineLine1"), t("headlineLine2")]}
      supporting={t("supporting")}
      illustration="sign-up"
      showHeadline={false}
    >
      <HideExcludedProviders />
      {role ? <RoleIntentBanner role={role} /> : null}
      <SignUp
        appearance={clerkAppearance}
        routing="path"
        path={`/${locale}/sign-up`}
        signInUrl={`/${locale}/sign-in`}
        initialValues={email ? { emailAddress: email } : undefined}
        forceRedirectUrl={
          role ? `/${locale}/onboarding?role=${role}` : `/${locale}/onboarding`
        }
      />
      <p className="mt-3 text-center text-xs leading-relaxed text-[var(--text-muted)]">
        {t.rich("legal", {
          terms: (chunks) => (
            <Link href="/terms" className="font-semibold text-[var(--ink)] underline hover:text-[var(--accent)]">
              {chunks}
            </Link>
          ),
          privacy: (chunks) => (
            <Link href="/privacy" className="font-semibold text-[var(--ink)] underline hover:text-[var(--accent)]">
              {chunks}
            </Link>
          ),
        })}
      </p>
    </AuthShell>
  );
}
