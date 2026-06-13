"use client";

import { Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/admin/AdminUI";
import { Button, Card } from "@/components/ds";
import { ErrorState } from "@/components/common/ErrorState";
import { useCmsHomepage, useUpdateCmsHomepage } from "@/lib/api/hooks";
import { ApiError } from "@/lib/api/client";
import { cn } from "@/lib/utils";
import type {
  CmsAdvisor,
  CmsHomepageContent,
  CmsHomepageStat,
  CmsPartnerLogo,
  CmsTeamMember,
  Locale,
} from "@/types/api";

const LOCALES: Locale[] = ["en", "fr", "zh"];

const controlClass =
  "w-full rounded-[var(--radius-md)] border border-[var(--ink-border)] bg-[var(--surface-card)] px-3.5 py-2.5 font-sans text-sm text-[var(--ink)] outline-none transition-[border-color,box-shadow] duration-150 ease-[ease] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_var(--accent-tint-08)]";
const labelClass =
  "mb-1.5 block font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--text-muted)]";

export default function AdminCmsHomepagePage() {
  const { data, isLoading, isError, refetch } = useCmsHomepage();

  if (isError) return <ErrorState onRetry={() => refetch()} />;
  if (isLoading || !data) {
    return (
      <div
        className="h-96 animate-pulse rounded-[var(--radius-card)] border border-[var(--accent-border)] bg-[var(--bg-section)]"
        aria-busy="true"
      />
    );
  }

  return <HomepageEditor content={data} />;
}

function HomepageEditor({ content }: { content: CmsHomepageContent }) {
  const t = useTranslations("adminPortal");
  const update = useUpdateCmsHomepage();

  const [stats, setStats] = useState<CmsHomepageStat[]>(content.stats ?? []);
  const [partners, setPartners] = useState<CmsPartnerLogo[]>(content.partner_logos ?? []);
  const [team, setTeam] = useState<CmsTeamMember[]>(content.team_members ?? []);
  const [advisory, setAdvisory] = useState<CmsAdvisor[]>(content.advisory_board ?? []);
  const [activeLocale, setActiveLocale] = useState<Locale>("en");

  async function save() {
    try {
      await update.mutateAsync({
        stats: stats.filter((s) => s.value.trim() !== ""),
        partner_logos: partners.filter((p) => p.name.trim() !== ""),
        team_members: team.filter((m) => m.name.trim() !== ""),
        advisory_board: advisory.filter((a) => a.name.trim() !== ""),
      });
      toast.success(t("cms.savedToast"));
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : t("actionError"));
    }
  }

  return (
    <div>
      <AdminPageHeader
        title={t("cms.homepageTitle")}
        subtitle={t("cms.homepageSubtitle")}
        action={
          <Button size="sm" disabled={update.isPending} onClick={save}>
            {update.isPending ? t("cms.saving") : t("cms.saveChanges")}
          </Button>
        }
      />

      <div className="flex flex-col gap-4">
        {/* Locale switch for translatable stat labels. */}
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
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-[var(--text-card-title-size)] font-semibold text-[var(--ink)]">
                {t("cms.statsTitle")}
              </h2>
              <p className="mt-1 text-xs text-[var(--text-muted)]">{t("cms.statsHint")}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => setStats((s) => [...s, { value: "", label: {} }])}
            >
              <Plus className="size-3.5" aria-hidden />
              {t("cms.addStat")}
            </Button>
          </div>
          {stats.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)]">{t("cms.noStats")}</p>
          ) : (
            <div className="grid gap-3">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="grid items-end gap-3 rounded-[var(--radius-md)] border border-[var(--accent-border)] p-3 sm:grid-cols-[160px_1fr_auto]"
                >
                  <div>
                    <label htmlFor={`stat-${i}-value`} className={labelClass}>
                      {t("cms.statValue")}
                    </label>
                    <input
                      id={`stat-${i}-value`}
                      className={controlClass}
                      value={stat.value}
                      placeholder="$3.4T"
                      onChange={(e) =>
                        setStats((prev) =>
                          prev.map((s, j) => (j === i ? { ...s, value: e.target.value } : s)),
                        )
                      }
                    />
                  </div>
                  <div>
                    <label htmlFor={`stat-${i}-label`} className={labelClass}>
                      {t("cms.statLabel")} ({activeLocale.toUpperCase()})
                    </label>
                    <input
                      id={`stat-${i}-label`}
                      className={controlClass}
                      value={stat.label?.[activeLocale] ?? ""}
                      onChange={(e) =>
                        setStats((prev) =>
                          prev.map((s, j) =>
                            j === i
                              ? { ...s, label: { ...s.label, [activeLocale]: e.target.value } }
                              : s,
                          ),
                        )
                      }
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setStats((prev) => prev.filter((_, j) => j !== i))}
                    aria-label={t("cms.removeStat")}
                    title={t("cms.removeStat")}
                    className="mb-1 grid size-9 place-items-center rounded-[var(--radius-md)] border border-[var(--ink-border)] text-[var(--text-muted)] transition-colors hover:border-[var(--p-danger)] hover:text-[var(--p-danger)]"
                  >
                    <Trash2 className="size-4" aria-hidden />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card hoverLift={false} padding="20px">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-[var(--text-card-title-size)] font-semibold text-[var(--ink)]">
                {t("cms.partnersTitle")}
              </h2>
              <p className="mt-1 text-xs text-[var(--text-muted)]">{t("cms.partnersHint")}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => setPartners((p) => [...p, { name: "" }])}
            >
              <Plus className="size-3.5" aria-hidden />
              {t("cms.addPartner")}
            </Button>
          </div>
          {partners.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)]">{t("cms.noPartners")}</p>
          ) : (
            <div className="grid gap-3">
              {partners.map((partner, i) => (
                <div
                  key={i}
                  className="grid items-end gap-3 rounded-[var(--radius-md)] border border-[var(--accent-border)] p-3 sm:grid-cols-[1fr_1fr_1fr_auto]"
                >
                  <div>
                    <label htmlFor={`partner-${i}-name`} className={labelClass}>
                      {t("cms.partnerName")}
                    </label>
                    <input
                      id={`partner-${i}-name`}
                      className={controlClass}
                      value={partner.name}
                      onChange={(e) =>
                        setPartners((prev) =>
                          prev.map((p, j) => (j === i ? { ...p, name: e.target.value } : p)),
                        )
                      }
                    />
                  </div>
                  <div>
                    <label htmlFor={`partner-${i}-logo`} className={labelClass}>
                      {t("cms.partnerLogoUrl")}
                    </label>
                    <input
                      id={`partner-${i}-logo`}
                      type="url"
                      placeholder="https://"
                      className={controlClass}
                      value={partner.logo_url ?? ""}
                      onChange={(e) =>
                        setPartners((prev) =>
                          prev.map((p, j) => (j === i ? { ...p, logo_url: e.target.value } : p)),
                        )
                      }
                    />
                  </div>
                  <div>
                    <label htmlFor={`partner-${i}-site`} className={labelClass}>
                      {t("cms.partnerWebsite")}
                    </label>
                    <input
                      id={`partner-${i}-site`}
                      type="url"
                      placeholder="https://"
                      className={controlClass}
                      value={partner.website ?? ""}
                      onChange={(e) =>
                        setPartners((prev) =>
                          prev.map((p, j) => (j === i ? { ...p, website: e.target.value } : p)),
                        )
                      }
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setPartners((prev) => prev.filter((_, j) => j !== i))}
                    aria-label={t("cms.removePartner")}
                    title={t("cms.removePartner")}
                    className="mb-1 grid size-9 place-items-center rounded-[var(--radius-md)] border border-[var(--ink-border)] text-[var(--text-muted)] transition-colors hover:border-[var(--p-danger)] hover:text-[var(--p-danger)]"
                  >
                    <Trash2 className="size-4" aria-hidden />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Team members — name fixed; role/bio are per-locale (About page). */}
        <Card hoverLift={false} padding="20px">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-[var(--text-card-title-size)] font-semibold text-[var(--ink)]">
                {t("cms.teamTitle")}
              </h2>
              <p className="mt-1 text-xs text-[var(--text-muted)]">{t("cms.teamHint")}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => setTeam((m) => [...m, { name: "" }])}
            >
              <Plus className="size-3.5" aria-hidden />
              {t("cms.addMember")}
            </Button>
          </div>
          {team.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)]">{t("cms.noTeam")}</p>
          ) : (
            <div className="grid gap-3">
              {team.map((member, i) => (
                <div
                  key={i}
                  className="rounded-[var(--radius-md)] border border-[var(--accent-border)] p-3"
                >
                  <div className="grid items-end gap-3 sm:grid-cols-[1fr_1fr_auto]">
                    <div>
                      <label htmlFor={`member-${i}-name`} className={labelClass}>
                        {t("cms.memberName")}
                      </label>
                      <input
                        id={`member-${i}-name`}
                        className={controlClass}
                        value={member.name}
                        onChange={(e) =>
                          setTeam((prev) =>
                            prev.map((m, j) => (j === i ? { ...m, name: e.target.value } : m)),
                          )
                        }
                      />
                    </div>
                    <div>
                      <label htmlFor={`member-${i}-photo`} className={labelClass}>
                        {t("cms.memberPhotoUrl")}
                      </label>
                      <input
                        id={`member-${i}-photo`}
                        type="url"
                        placeholder="https://"
                        className={controlClass}
                        value={member.photo_url ?? ""}
                        onChange={(e) =>
                          setTeam((prev) =>
                            prev.map((m, j) =>
                              j === i ? { ...m, photo_url: e.target.value } : m,
                            ),
                          )
                        }
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setTeam((prev) => prev.filter((_, j) => j !== i))}
                      aria-label={t("cms.removeMember")}
                      title={t("cms.removeMember")}
                      className="mb-1 grid size-9 place-items-center rounded-[var(--radius-md)] border border-[var(--ink-border)] text-[var(--text-muted)] transition-colors hover:border-[var(--p-danger)] hover:text-[var(--p-danger)]"
                    >
                      <Trash2 className="size-4" aria-hidden />
                    </button>
                  </div>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <div>
                      <label htmlFor={`member-${i}-role`} className={labelClass}>
                        {t("cms.memberRole")} ({activeLocale.toUpperCase()})
                      </label>
                      <input
                        id={`member-${i}-role`}
                        className={controlClass}
                        value={member.role?.[activeLocale] ?? ""}
                        onChange={(e) =>
                          setTeam((prev) =>
                            prev.map((m, j) =>
                              j === i
                                ? { ...m, role: { ...m.role, [activeLocale]: e.target.value } }
                                : m,
                            ),
                          )
                        }
                      />
                    </div>
                    <div>
                      <label htmlFor={`member-${i}-bio`} className={labelClass}>
                        {t("cms.memberBio")} ({activeLocale.toUpperCase()})
                      </label>
                      <input
                        id={`member-${i}-bio`}
                        className={controlClass}
                        value={member.bio?.[activeLocale] ?? ""}
                        onChange={(e) =>
                          setTeam((prev) =>
                            prev.map((m, j) =>
                              j === i
                                ? { ...m, bio: { ...m.bio, [activeLocale]: e.target.value } }
                                : m,
                            ),
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Advisory board — name + organization fixed; role per-locale. */}
        <Card hoverLift={false} padding="20px">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-[var(--text-card-title-size)] font-semibold text-[var(--ink)]">
                {t("cms.advisoryTitle")}
              </h2>
              <p className="mt-1 text-xs text-[var(--text-muted)]">{t("cms.advisoryHint")}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => setAdvisory((a) => [...a, { name: "" }])}
            >
              <Plus className="size-3.5" aria-hidden />
              {t("cms.addAdvisor")}
            </Button>
          </div>
          {advisory.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)]">{t("cms.noAdvisory")}</p>
          ) : (
            <div className="grid gap-3">
              {advisory.map((advisor, i) => (
                <div
                  key={i}
                  className="grid items-end gap-3 rounded-[var(--radius-md)] border border-[var(--accent-border)] p-3 sm:grid-cols-[1fr_1fr_1fr_auto]"
                >
                  <div>
                    <label htmlFor={`advisor-${i}-name`} className={labelClass}>
                      {t("cms.advisorName")}
                    </label>
                    <input
                      id={`advisor-${i}-name`}
                      className={controlClass}
                      value={advisor.name}
                      onChange={(e) =>
                        setAdvisory((prev) =>
                          prev.map((a, j) => (j === i ? { ...a, name: e.target.value } : a)),
                        )
                      }
                    />
                  </div>
                  <div>
                    <label htmlFor={`advisor-${i}-org`} className={labelClass}>
                      {t("cms.advisorOrg")}
                    </label>
                    <input
                      id={`advisor-${i}-org`}
                      className={controlClass}
                      value={advisor.organization ?? ""}
                      onChange={(e) =>
                        setAdvisory((prev) =>
                          prev.map((a, j) =>
                            j === i ? { ...a, organization: e.target.value } : a,
                          ),
                        )
                      }
                    />
                  </div>
                  <div>
                    <label htmlFor={`advisor-${i}-role`} className={labelClass}>
                      {t("cms.advisorRole")} ({activeLocale.toUpperCase()})
                    </label>
                    <input
                      id={`advisor-${i}-role`}
                      className={controlClass}
                      value={advisor.role?.[activeLocale] ?? ""}
                      onChange={(e) =>
                        setAdvisory((prev) =>
                          prev.map((a, j) =>
                            j === i
                              ? { ...a, role: { ...a.role, [activeLocale]: e.target.value } }
                              : a,
                          ),
                        )
                      }
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setAdvisory((prev) => prev.filter((_, j) => j !== i))}
                    aria-label={t("cms.removeAdvisor")}
                    title={t("cms.removeAdvisor")}
                    className="mb-1 grid size-9 place-items-center rounded-[var(--radius-md)] border border-[var(--ink-border)] text-[var(--text-muted)] transition-colors hover:border-[var(--p-danger)] hover:text-[var(--p-danger)]"
                  >
                    <Trash2 className="size-4" aria-hidden />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>

        <div>
          <Button disabled={update.isPending} onClick={save}>
            {update.isPending ? t("cms.saving") : t("cms.saveChanges")}
          </Button>
        </div>
      </div>
    </div>
  );
}
