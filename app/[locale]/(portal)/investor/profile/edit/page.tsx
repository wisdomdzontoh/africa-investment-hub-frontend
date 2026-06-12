"use client";

import { ArrowLeft, Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button, Card } from "@/components/ds";
import { ErrorState } from "@/components/common/ErrorState";
import { Link, useRouter } from "@/i18n/navigation";
import { PortalPage } from "@/components/portal";
import { useInvestorProfile, useUpdateInvestorProfile } from "@/lib/api/hooks";
import { ApiError } from "@/lib/api/client";
import { COUNTRIES, getCountry } from "@/lib/data/countries";
import { SECTORS } from "@/lib/data/sectors";
import { cn } from "@/lib/utils";
import type { InvestorProfile } from "@/types/api";

const RISK_LEVELS = ["low", "medium", "high"] as const;

const controlClass =
  "w-full rounded-[var(--radius-md)] border border-[var(--ink-border)] bg-[var(--surface-card)] px-3.5 py-2.5 font-sans text-sm text-[var(--ink)] outline-none transition-[border-color,box-shadow] duration-150 ease-[ease] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_var(--accent-tint-08)]";
const labelClass =
  "mb-1.5 block font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--text-muted)]";

/** Controlled chip multi-select on portal tokens (no form context needed). */
function ChipToggleGroup({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: { value: string; label: string }[];
  selected: string[];
  onChange: (next: string[]) => void;
}) {
  const toggle = (value: string) =>
    onChange(
      selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value],
    );
  return (
    <fieldset>
      <legend className={labelClass}>{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const on = selected.includes(o.value);
          return (
            <button
              type="button"
              key={o.value}
              onClick={() => toggle(o.value)}
              aria-pressed={on}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] border px-3 py-1.5 text-sm transition-colors",
                on
                  ? "border-[var(--accent)] bg-[var(--accent-tint-08)] font-medium text-[var(--accent)]"
                  : "border-[var(--ink-border)] bg-[var(--surface-card)] text-[var(--text-body)] hover:border-[var(--accent)]",
              )}
            >
              {on ? <Check className="size-3.5" aria-hidden /> : null}
              {o.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

type ProfileForm = {
  company_name: string;
  website: string;
  registered_address: string;
  contact_name: string;
  contact_title: string;
  contact_email: string;
  contact_phone: string;
};

export default function EditInvestorProfilePage() {
  const t = useTranslations("investorPortal");
  const { data: profile, isLoading, isError, refetch } = useInvestorProfile();

  if (isLoading) {
    return (
      <div
        className="h-96 animate-pulse rounded-[var(--radius-card)] border border-[var(--accent-border)] bg-[var(--bg-section)]"
        aria-busy="true"
      />
    );
  }
  if (isError || !profile) {
    return (
      <ErrorState
        title={t("noProfile")}
        description={t("noProfileDesc")}
        onRetry={() => refetch()}
        action={
          <Button href="/investor" variant="outline" size="sm">
            {t("backToOverview")}
          </Button>
        }
      />
    );
  }

  return <EditProfileForm profile={profile} />;
}

function EditProfileForm({ profile }: { profile: InvestorProfile }) {
  const t = useTranslations("investorPortal");
  const router = useRouter();
  const updateProfile = useUpdateInvestorProfile();

  const [sectors, setSectors] = useState<string[]>(profile.investment_sectors);
  const [markets, setMarkets] = useState<string[]>(profile.investment_countries);
  const [risk, setRisk] = useState<string>(profile.risk_appetite ?? "");

  const {
    register: field,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileForm>({
    defaultValues: {
      company_name: profile.company_name,
      website: profile.website ?? "",
      registered_address: profile.registered_address ?? "",
      contact_name: profile.contact_name ?? "",
      contact_title: profile.contact_title ?? "",
      contact_email: profile.contact_email ?? "",
      contact_phone: profile.contact_phone ?? "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    const optText = (v: string) => (v.trim() === "" ? null : v.trim());
    try {
      await updateProfile.mutateAsync({
        company_name: values.company_name.trim(),
        website: optText(values.website),
        registered_address: optText(values.registered_address),
        contact_name: optText(values.contact_name),
        contact_title: optText(values.contact_title),
        contact_email: optText(values.contact_email),
        contact_phone: optText(values.contact_phone),
        investment_sectors: sectors,
        investment_countries: markets,
        risk_appetite: risk || null,
      });
      toast.success(t("profileUpdated"));
      router.push("/investor/profile");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : t("profileUpdateError"));
    }
  });

  return (
    <PortalPage title={t("editProfile")} description={t("editProfileDesc")}>
      <Link
        href="/investor/profile"
        className="-mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--accent)] no-underline hover:underline"
      >
        <ArrowLeft size={15} aria-hidden />
        {t("backToProfile")}
      </Link>

      <form onSubmit={onSubmit} className="grid max-w-3xl gap-4" noValidate>
        <Card hoverLift={false}>
          <h2 className="mb-4 text-[var(--text-card-title-size)] font-semibold text-[var(--ink)]">
            {t("secCompany")}
          </h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="company_name" className={labelClass}>
                {t("companyLabel")}
              </label>
              <input
                id="company_name"
                className={controlClass}
                aria-invalid={Boolean(errors.company_name)}
                {...field("company_name", { required: true })}
              />
              {errors.company_name ? (
                <p className="mt-1 text-xs text-[var(--p-danger)]">{t("fieldRequired")}</p>
              ) : null}
            </div>
            <div>
              <span className={labelClass}>{t("country")}</span>
              {/* Country of registration is verified at onboarding and immutable. */}
              <p className="px-0.5 py-2 text-sm text-[var(--text-body)]">
                {getCountry(profile.country_of_registration)?.name ??
                  profile.country_of_registration.toUpperCase()}
              </p>
            </div>
            <div>
              <label htmlFor="website" className={labelClass}>
                {t("websiteLabel")}
              </label>
              <input
                id="website"
                type="url"
                placeholder="https://"
                className={controlClass}
                {...field("website")}
              />
            </div>
            <div>
              <label htmlFor="registered_address" className={labelClass}>
                {t("addressLabel")}
              </label>
              <input
                id="registered_address"
                className={controlClass}
                {...field("registered_address")}
              />
            </div>
            <div>
              <label htmlFor="contact_name" className={labelClass}>
                {t("contact")}
              </label>
              <input id="contact_name" className={controlClass} {...field("contact_name")} />
            </div>
            <div>
              <label htmlFor="contact_title" className={labelClass}>
                {t("contactTitleLabel")}
              </label>
              <input id="contact_title" className={controlClass} {...field("contact_title")} />
            </div>
            <div>
              <label htmlFor="contact_email" className={labelClass}>
                {t("email")}
              </label>
              <input
                id="contact_email"
                type="email"
                className={controlClass}
                aria-invalid={Boolean(errors.contact_email)}
                {...field("contact_email", {
                  pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                })}
              />
              {errors.contact_email ? (
                <p className="mt-1 text-xs text-[var(--p-danger)]">{t("emailInvalid")}</p>
              ) : null}
            </div>
            <div>
              <label htmlFor="contact_phone" className={labelClass}>
                {t("phoneLabel")}
              </label>
              <input
                id="contact_phone"
                type="tel"
                className={controlClass}
                {...field("contact_phone")}
              />
            </div>
          </div>
        </Card>

        <Card hoverLift={false}>
          <h2 className="mb-4 text-[var(--text-card-title-size)] font-semibold text-[var(--ink)]">
            {t("secInvestment")}
          </h2>
          <div className="grid gap-6">
            <ChipToggleGroup
              label={t("sectors")}
              options={SECTORS.map((s) => ({ value: s.id, label: s.name }))}
              selected={sectors}
              onChange={setSectors}
            />
            <ChipToggleGroup
              label={t("markets")}
              options={COUNTRIES.map((c) => ({ value: c.code, label: c.name }))}
              selected={markets}
              onChange={setMarkets}
            />
            <div className="max-w-xs">
              <label htmlFor="risk_appetite" className={labelClass}>
                {t("riskLabel")}
              </label>
              <select
                id="risk_appetite"
                className={controlClass}
                value={risk}
                onChange={(e) => setRisk(e.target.value)}
              >
                <option value="">{t("riskUnset")}</option>
                {RISK_LEVELS.map((r) => (
                  <option key={r} value={r}>
                    {t(`riskOptions.${r}`)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={updateProfile.isPending}>
            {updateProfile.isPending ? t("saving") : t("saveChanges")}
          </Button>
          <Button href="/investor/profile" variant="outline">
            {t("cancel")}
          </Button>
        </div>
      </form>
    </PortalPage>
  );
}
