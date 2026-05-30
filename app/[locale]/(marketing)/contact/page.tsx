import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import { ContactForm } from "@/features/contact/ContactForm";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");

  return (
    <div className="page py-12">
      <div className="mb-8 max-w-[560px]">
        <h1 className="h1">{t("title")}</h1>
        <p className="lead mt-3">{t("subtitle")}</p>
      </div>
      <div className="max-w-xl">
        <ContactForm />
      </div>
    </div>
  );
}
