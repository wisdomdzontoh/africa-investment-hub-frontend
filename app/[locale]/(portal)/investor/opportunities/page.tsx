"use client";

import { Check, ExternalLink, Handshake, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Card } from "@/components/ds";
import { Flag } from "@/components/common/Flag";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { PortalPage, StatusPill } from "@/components/portal";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "@/i18n/navigation";
import { ApiError } from "@/lib/api/client";
import {
  useBrowseProjects,
  useInvestorMatches,
  useProjectInterest,
  type BrowseProject,
} from "@/lib/api/hooks";
import { COUNTRIES } from "@/lib/data/countries";
import { SECTORS, getSector } from "@/lib/data/sectors";
import { fmtMoney } from "@/lib/format";

const ALL = "__all__";

/** Match statuses that mean the investor has already raised their hand. */
const ENGAGED = new Set([
  "investor_interested",
  "nda_sent",
  "nda_signed",
  "confidential",
  "mou_drafted",
  "mou_signed",
  "in_negotiation",
  "due_diligence",
  "closed_won",
]);

function BrowseSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-busy="true">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="h-52 animate-pulse rounded-[var(--radius-card)] border border-[var(--accent-border)] bg-[var(--bg-section)]"
        />
      ))}
    </div>
  );
}

export default function InvestorBrowsePage() {
  const t = useTranslations("investorPortal");
  const [sector, setSector] = useState<string>(ALL);
  const [country, setCountry] = useState<string>(ALL);

  const { data, isLoading, isError, refetch } = useBrowseProjects({
    sector: sector === ALL ? undefined : sector,
    country: country === ALL ? undefined : country,
  });
  const { data: matches } = useInvestorMatches();
  const interest = useProjectInterest();
  const [justSent, setJustSent] = useState<Set<string>>(new Set());

  // Projects the investor already engaged with (any active pipeline stage).
  const engagedProjects = useMemo(() => {
    const ids = new Set<string>();
    for (const m of matches?.items ?? []) {
      if (ENGAGED.has(m.status)) ids.add(m.project_id);
    }
    return ids;
  }, [matches]);

  async function expressInterest(project: BrowseProject) {
    try {
      await interest.mutateAsync(project.id);
      setJustSent((prev) => new Set(prev).add(project.id));
      toast.success(t("interestSent"));
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : t("interestError"));
    }
  }

  const items = data?.items ?? [];

  return (
    <PortalPage title={t("browse")} description={t("browseDesc")}>
      <div className="flex flex-wrap items-center gap-3">
        <Select value={sector} onValueChange={setSector}>
          <SelectTrigger className="h-9 w-52" aria-label={t("filterSector")}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>{t("allSectors")}</SelectItem>
            {SECTORS.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={country} onValueChange={setCountry}>
          <SelectTrigger className="h-9 w-52" aria-label={t("filterCountry")}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>{t("allCountries")}</SelectItem>
            {COUNTRIES.map((c) => (
              <SelectItem key={c.code} value={c.code}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <BrowseSkeleton />
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : items.length === 0 ? (
        <EmptyState title={t("browseEmpty")} />
      ) : (
        <div className="grid items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((p) => {
            const engaged = engagedProjects.has(p.id) || justSent.has(p.id);
            const countryName =
              COUNTRIES.find((c) => c.code === p.country.toLowerCase())?.name ??
              p.country.toUpperCase();
            return (
              <Card key={p.id} hoverLift={false} padding="20px" className="flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="min-w-0 flex-1 text-[15px] font-semibold leading-snug text-[var(--ink)]">
                    {p.title}
                  </h2>
                  {p.is_featured ? (
                    <Sparkles className="size-4 shrink-0 text-[var(--accent)]" aria-hidden />
                  ) : null}
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--text-muted)]">
                  <span className="rounded-[var(--radius-pill)] bg-[var(--accent-tint-08)] px-2 py-0.5 font-medium text-[var(--accent)]">
                    {getSector(p.sector).name}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Flag code={p.country.toLowerCase()} />
                    {countryName}
                  </span>
                  {p.risk_level ? <StatusPill status={p.risk_level} /> : null}
                </div>

                <p className="line-clamp-2 flex-1 text-sm text-[var(--text-body)]">
                  {p.brief_description}
                </p>

                <dl className="flex items-center gap-4 border-t border-[var(--accent-border)] pt-3 font-mono text-xs">
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.06em] text-[var(--text-muted)]">
                      {t("browseFunding")}
                    </dt>
                    <dd className="mt-0.5 font-semibold text-[var(--ink)]">
                      {fmtMoney(Number(p.funding_required))}
                    </dd>
                  </div>
                  {p.expected_roi_min || p.expected_roi_max ? (
                    <div>
                      <dt className="text-[10px] uppercase tracking-[0.06em] text-[var(--text-muted)]">
                        {t("browseRoi")}
                      </dt>
                      <dd className="mt-0.5 font-semibold text-[var(--ink)]">
                        {Number(p.expected_roi_min ?? 0)}–{Number(p.expected_roi_max ?? 0)}%
                      </dd>
                    </div>
                  ) : null}
                </dl>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    disabled={engaged || interest.isPending}
                    onClick={() => expressInterest(p)}
                    className="flex-1 gap-1.5"
                  >
                    {engaged ? (
                      <Check className="size-4" aria-hidden />
                    ) : (
                      <Handshake className="size-4" aria-hidden />
                    )}
                    {engaged ? t("interested") : t("expressInterest")}
                  </Button>
                  <Button size="sm" variant="outline" asChild className="gap-1.5">
                    <Link href={`/opportunities/${p.id}`} className="no-underline">
                      <ExternalLink className="size-3.5" aria-hidden />
                      {t("viewDetails")}
                    </Link>
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </PortalPage>
  );
}
