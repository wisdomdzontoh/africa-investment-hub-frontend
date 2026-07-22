import { setRequestLocale } from "next-intl/server";
import { LegalArticle } from "@/components/marketing/LegalArticle";

const SECTIONS = [
  "role",
  "eligibility",
  "verification",
  "interactions",
  "confidentiality",
  "acceptableUse",
  "ip",
  "disclaimers",
  "liability",
  "termination",
  "changes",
  "contact",
] as const;

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <LegalArticle ns="legal.terms" sections={SECTIONS} />;
}
