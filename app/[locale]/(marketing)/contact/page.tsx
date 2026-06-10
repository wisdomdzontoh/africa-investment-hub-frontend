import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import { ContactForm } from "@/features/contact/ContactForm";
import { PageHero } from "@/components/marketing/PageHero";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");

  return (
    <>
      <PageHero title={t("title")} subtitle={t("subtitle")} eyebrow={t("eyebrow")} />
      <div className="page py-12">
        <div className="max-w-xl">
          <ContactForm />
        </div>
      </div>
    </>
  );
}
