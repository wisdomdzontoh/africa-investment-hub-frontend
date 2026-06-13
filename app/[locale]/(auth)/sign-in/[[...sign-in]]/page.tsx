import { SignIn } from "@clerk/nextjs";
import { AuthShell } from "@/components/auth/AuthShell";
import { clerkAppearance } from "@/lib/clerk/appearance";

export default async function SignInPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <AuthShell mode="sign-in">
      <SignIn
        appearance={clerkAppearance}
        routing="path"
        path={`/${locale}/sign-in`}
        signUpUrl={`/${locale}/sign-up`}
      />
    </AuthShell>
  );
}
