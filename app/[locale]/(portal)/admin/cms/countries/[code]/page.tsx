"use client";

import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/admin/AdminUI";
import { Button, Card } from "@/components/ds";
import { ErrorState } from "@/components/common/ErrorState";
import { Link } from "@/i18n/navigation";
import { StatusPill } from "@/components/portal";
import { useCmsCountry, useUpsertCmsCountry } from "@/lib/api/hooks";
import { ApiError } from "@/lib/api/client";
import { COUNTRIES } from "@/lib/data/countries";
import { cn } from "@/lib/utils";
import type {
  CmsCountryContent,
  CmsKeyContact,
  Locale,
  LocaleText,
} from "@/types/api";

const LOCALES: Locale[] = ["en", "fr", "zh"];

const SECTIONS = [
  "investment_climate",
  "investment_laws",
  "tax_system",
  "business_registration",
  "licensing_requirements",
  "foreign_ownership_rules",
  "repatriation_policy",
  "immigration_requirements",
] as const;

type SectionKey = (typeof SECTIONS)[number];
type SectionState = Record<SectionKey, LocaleText>;

const controlClass =
  "w-full rounded-[var(--radius-md)] border border-[var(--ink-border)] bg-[var(--surface-card)] px-3.5 py-2.5 font-sans text-sm text-[var(--ink)] outline-none transition-[border-color,box-shadow] duration-150 ease-[ease] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_var(--accent-tint-08)]";
const labelClass =
  "mb-1.5 block font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--text-muted)]";

function emptySections(): SectionState {
  return SECTIONS.reduce((acc, s) => ({ ...acc, [s]: {} }), {} as SectionState);
}

function toSectionState(content: CmsCountryContent): SectionState {
  return SECTIONS.reduce(
    (acc, s) => ({ ...acc, [s]: content[s] ?? {} }),
    {} as SectionState,
  );
}

export default function AdminCmsCountryEditorPage() {
  const t = useTranslations("adminPortal");
  const params = useParams<{ code: string }>();
  const code = (params.code ?? "").toUpperCase();
  const { data, isLoading, error, refetch } = useCmsCountry(code);

  if (isLoading) {
    return (
      <div
        className="h-96 animate-pulse rounded-[var(--radius-card)] border border-[var(--accent-border)] bg-[var(--bg-section)]"
        aria-busy="true"
      />
    );
  }

  const notFound = error instanceof ApiError && error.status === 404;
  if (error && !notFound) {
    return (
      <ErrorState
        onRetry={() => refetch()}
        action={
          <Button href="/admin/cms/countries" variant="outline" size="sm">
            {t("cms.backToCountries")}
          </Button>
        }
      />
    );
  }

  return <CountryEditor key={code} code={code} content={data ?? null} />;
}

function CountryEditor({ code, content }: { code: string; content: CmsCountryContent | null }) {
  const t = useTranslations("adminPortal");
  const upsert = useUpsertCmsCountry();

  const fallbackName = COUNTRIES.find((c) => c.code.toUpperCase() === code)?.name ?? code;
  const [name, setName] = useState(content?.country_name ?? fallbackName);
  const [region, setRegion] = useState(content?.region ?? "");
  const [sections, setSections] = useState<SectionState>(
    content ? toSectionState(content) : emptySections(),
  );
  const [contacts, setContacts] = useState<CmsKeyContact[]>(content?.key_contacts ?? []);
  const [activeLocale, setActiveLocale] = useState<Locale>("en");
  const isPublished = content?.is_published ?? false;

  const setSection = (key: SectionKey, value: string) =>
    setSections((prev) => ({
      ...prev,
      [key]: { ...prev[key], [activeLocale]: value },
    }));

  async function save(publish: boolean) {
    if (!name.trim()) {
      toast.error(t("cms.nameRequired"));
      return;
    }
    try {
      await upsert.mutateAsync({
        code,
        body: {
          country_name: name.trim(),
          region: region.trim() || null,
          ...sections,
          key_contacts: contacts.filter((c) =>
            Object.values(c).some((v) => (v ?? "").trim() !== ""),
          ),
          publish,
        },
      });
      toast.success(publish ? t("cms.publishedToast") : t("cms.savedToast"));
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : t("actionError"));
    }
  }

  return (
    <div>
      <AdminPageHeader
        title={`${name} · ${code}`}
        subtitle={t("cms.countryEditorSubtitle")}
        action={
          <div className="flex items-center gap-2.5">
            <StatusPill
              status={isPublished ? "live" : "draft"}
              label={isPublished ? t("cms.published") : t("cms.draft")}
            />
            <Button
              variant="outline"
              size="sm"
              disabled={upsert.isPending}
              onClick={() => save(false)}
            >
              {upsert.isPending ? t("cms.saving") : t("cms.saveDraft")}
            </Button>
            <Button size="sm" disabled={upsert.isPending} onClick={() => save(true)}>
              {t("cms.publish")}
            </Button>
          </div>
        }
      />

      <Link
        href="/admin/cms/countries"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--accent)] no-underline hover:underline"
      >
        <ArrowLeft size={15} aria-hidden />
        {t("cms.backToCountries")}
      </Link>

      <div className="flex flex-col gap-4">
        <Card hoverLift={false} padding="20px">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="country_name" className={labelClass}>
                {t("cms.colName")}
              </label>
              <input
                id="country_name"
                className={controlClass}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="region" className={labelClass}>
                {t("cms.colRegion")}
              </label>
              <input
                id="region"
                className={controlClass}
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                placeholder={t("cms.regionPlaceholder")}
              />
            </div>
          </div>
        </Card>

        {/* Locale switch — every section below edits the active locale. */}
        <div
          role="tablist"
          aria-label={t("cms.localeTabs")}
          className="flex w-fit items-center gap-1 rounded-[var(--radius-md)] border border-[var(--accent-border)] bg-[var(--surface-card)] p-1"
        >
          {LOCALES.map((loc) => (
            <button
              key={loc}
              role="tab"
              type="button"
              aria-selected={activeLocale === loc}
              onClick={() => setActiveLocale(loc)}
              className={cn(
                "rounded-[var(--radius-icon)] px-4 py-1.5 font-mono text-xs font-semibold uppercase tracking-[0.06em] transition-colors",
                activeLocale === loc
                  ? "bg-[var(--accent)] text-white"
                  : "text-[var(--text-muted)] hover:text-[var(--ink)]",
              )}
            >
              {loc}
            </button>
          ))}
        </div>

        <Card hoverLift={false} padding="20px">
          <div className="grid gap-6">
            {SECTIONS.map((key) => (
              <div key={key}>
                <label htmlFor={`section-${key}`} className={labelClass}>
                  {t(`cms.sections.${key}`)}
                </label>
                <textarea
                  id={`section-${key}`}
                  className={`${controlClass} min-h-28`}
                  value={sections[key][activeLocale] ?? ""}
                  onChange={(e) => setSection(key, e.target.value)}
                  placeholder={t("cms.sectionPlaceholder", { locale: activeLocale.toUpperCase() })}
                />
              </div>
            ))}
          </div>
        </Card>

        <Card hoverLift={false} padding="20px">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[var(--text-card-title-size)] font-semibold text-[var(--ink)]">
              {t("cms.keyContacts")}
            </h2>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => setContacts((c) => [...c, {}])}
            >
              <Plus className="size-3.5" aria-hidden />
              {t("cms.addContact")}
            </Button>
          </div>
          {contacts.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)]">{t("cms.noContacts")}</p>
          ) : (
            <div className="grid gap-3">
              {contacts.map((contact, i) => (
                <div
                  key={i}
                  className="grid items-end gap-3 rounded-[var(--radius-md)] border border-[var(--accent-border)] p-3 sm:grid-cols-[1fr_1fr_1fr_1fr_auto]"
                >
                  {(["organization", "name", "role", "email"] as const).map((f) => (
                    <div key={f}>
                      <label htmlFor={`contact-${i}-${f}`} className={labelClass}>
                        {t(`cms.contactFields.${f}`)}
                      </label>
                      <input
                        id={`contact-${i}-${f}`}
                        type={f === "email" ? "email" : "text"}
                        className={controlClass}
                        value={contact[f] ?? ""}
                        onChange={(e) =>
                          setContacts((prev) =>
                            prev.map((c, j) => (j === i ? { ...c, [f]: e.target.value } : c)),
                          )
                        }
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setContacts((prev) => prev.filter((_, j) => j !== i))}
                    aria-label={t("cms.removeContact")}
                    title={t("cms.removeContact")}
                    className="mb-1 grid size-9 place-items-center rounded-[var(--radius-md)] border border-[var(--ink-border)] text-[var(--text-muted)] transition-colors hover:border-[var(--p-danger)] hover:text-[var(--p-danger)]"
                  >
                    <Trash2 className="size-4" aria-hidden />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>

        <div className="flex items-center gap-3">
          <Button variant="outline" disabled={upsert.isPending} onClick={() => save(false)}>
            {upsert.isPending ? t("cms.saving") : t("cms.saveDraft")}
          </Button>
          <Button disabled={upsert.isPending} onClick={() => save(true)}>
            {t("cms.publish")}
          </Button>
        </div>
      </div>
    </div>
  );
}
