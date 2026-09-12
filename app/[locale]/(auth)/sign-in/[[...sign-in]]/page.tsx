import { SignIn } from "@clerk/nextjs";
import { getTranslations } from "next-intl/server";
import { AuthShell } from "@/components/auth/AuthShell";
import { HideExcludedProviders } from "@/components/auth/HideExcludedProviders";
import { clerkAppearance } from "@/lib/clerk/appearance";

export default async function SignInPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("auth.signIn");

  return (
    <AuthShell headline={t("headline")} supporting={t("supporting")} illustration="sign-in">
      <HideExcludedProviders />
      <SignIn
        appearance={clerkAppearance}
        routing="path"
        path={`/${locale}/sign-in`}
        signUpUrl={`/${locale}/sign-up`}
      />
    </AuthShell>
  );
}
