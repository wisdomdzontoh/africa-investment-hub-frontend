import { SignUp } from "@clerk/nextjs";
import { Building2, Compass } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { AuthShell } from "@/components/auth/AuthShell";
import { Link } from "@/i18n/navigation";
import { clerkAppearance } from "@/lib/clerk/appearance";

type RoleIntent = "investor" | "facilitator";

function parseRole(value: string | string[] | undefined): RoleIntent | null {
  return value === "investor" || value === "facilitator" ? value : null;
}

/** Audience banner above the sign-up card when a CTA carried role intent
 *  (FE-08). The role is forwarded to onboarding to pre-seed the choice. */
async function RoleIntentBanner({ role }: { role: RoleIntent }) {
  const t = await getTranslations("auth");
  const Icon = role === "investor" ? Compass : Building2;
  const other: RoleIntent = role === "investor" ? "facilitator" : "investor";
  return (
    <div className="mb-5 w-full rounded-[var(--radius-md)] border border-[var(--accent-border)] bg-[var(--accent-tint-06)] p-4">
      <div className="flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-icon)] bg-[var(--accent-tint-10)] text-[var(--accent)]">
          <Icon size={18} aria-hidden />
        </span>
        <div>
          <p className="font-semibold text-[var(--ink)]">
            {t(role === "investor" ? "intentInvestorTitle" : "intentFacilitatorTitle")}
          </p>
          <p className="mt-0.5 text-sm leading-relaxed text-[var(--text-body)]">
            {t(role === "investor" ? "intentInvestorBody" : "intentFacilitatorBody")}
          </p>
          <Link
            href={`/sign-up?role=${other}`}
            className="mt-1.5 inline-block text-sm font-semibold text-[var(--accent)] no-underline hover:underline"
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
  const role = parseRole((await searchParams).role);

  return (
    <AuthShell>
      {role ? <RoleIntentBanner role={role} /> : null}
      <SignUp
        appearance={clerkAppearance}
        routing="path"
        path={`/${locale}/sign-up`}
        signInUrl={`/${locale}/sign-in`}
        forceRedirectUrl={
          role ? `/${locale}/onboarding?role=${role}` : `/${locale}/onboarding`
        }
      />
    </AuthShell>
  );
}
