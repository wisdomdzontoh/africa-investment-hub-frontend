import { setRequestLocale } from "next-intl/server";
import { LegalArticle } from "@/components/marketing/LegalArticle";

const SECTIONS = [
  "scope",
  "collected",
  "use",
  "processors",
  "sharing",
  "retention",
  "security",
  "rights",
  "transfers",
  "cookies",
  "changes",
  "contact",
] as const;

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <LegalArticle ns="legal.privacy" sections={SECTIONS} />;
}
