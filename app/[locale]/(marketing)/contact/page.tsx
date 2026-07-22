import { Clock3, Globe2, Mail, Phone } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
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

  const details = [
    {
      icon: Mail,
      label: t("info.emailLabel"),
      value: t("info.email"),
      href: `mailto:${t("info.email")}`,
    },
    {
      icon: Phone,
      label: t("info.phoneLabel"),
      value: t("info.phone"),
      href: `tel:${t("info.phone").replace(/\s/g, "")}`,
    },
    {
      icon: Clock3,
      label: t("info.hoursLabel"),
      value: t("info.hoursBody"),
    },
    {
      icon: Globe2,
      label: t("info.coverageLabel"),
      value: t("info.coverageBody"),
    },
  ];

  return (
    <>
      <PageHero title={t("title")} subtitle={t("subtitle")} eyebrow={t("eyebrow")} />
      <div className="page py-12">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <aside className="lg:pt-1">
            <ul className="m-0 flex list-none flex-col gap-1 p-0">
              {details.map(({ icon: Icon, label, value, href }) => (
                <li
                  key={label}
                  className="flex items-start gap-4 rounded-[var(--radius-base)] p-4 transition-colors hover:bg-[var(--bg-section)]"
                >
                  <span className="mt-0.5 inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--accent-tint-10)] text-[var(--accent)]">
                    <Icon className="size-[18px]" aria-hidden />
                  </span>
                  <div>
                    <div className="text-[13px] font-semibold uppercase tracking-[0.06em] text-[var(--text-muted)]">
                      {label}
                    </div>
                    {href ? (
                      <a
                        href={href}
                        className="mt-1 inline-block font-semibold text-[var(--ink)] no-underline hover:text-[var(--accent)]"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="m-0 mt-1 text-[15px] leading-relaxed text-[var(--text-body)]">
                        {value}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-6 rounded-[var(--radius-base)] border border-[var(--accent-border)] bg-[var(--bg-section)] p-5">
              <p className="m-0 text-sm leading-relaxed text-[var(--text-body)]">
                {t("info.note")}
              </p>
            </div>
          </aside>

          <div>
            <ContactForm />
          </div>
        </div>
      </div>
    </>
  );
}
