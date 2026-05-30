import { SignIn } from "@clerk/nextjs";
import { clerkAppearance } from "@/lib/clerk/appearance";

export default async function SignInPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <SignIn
        appearance={clerkAppearance}
        routing="path"
        path={`/${locale}/sign-in`}
        signUpUrl={`/${locale}/sign-up`}
      />
    </div>
  );
}
