import { SignUp } from "@clerk/nextjs";
import { clerkAppearance } from "@/lib/clerk/appearance";

export default async function SignUpPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <SignUp
        appearance={clerkAppearance}
        routing="path"
        path={`/${locale}/sign-up`}
        signInUrl={`/${locale}/sign-in`}
      />
    </div>
  );
}
