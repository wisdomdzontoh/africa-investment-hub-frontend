"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Badge,
  Button,
  ChecklistRow,
  ProgressBar,
  Tabs,
} from "@/components/ds";

const TAB_KEYS = ["discover", "verify", "diligence", "monitor"] as const;

export function FeatureTabsSection() {
  const t = useTranslations("home.featureTabs");
  const [active, setActive] = useState(0);
  const tabKey = TAB_KEYS[active];

  return (
    <section className="bg-[var(--bg-section)] py-[clamp(3rem,7vw,7.5rem)]">
      <div className="page">
        <div className="mx-auto mb-12 max-w-[760px] text-center">
          <h2 className="text-balance text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.15] tracking-[-0.02em] text-[var(--ink)]">
            {t("title")}
          </h2>
        </div>

        <div className="rounded-[var(--radius-panel)] bg-[var(--surface-dark)] p-5">
          <div className="mb-[18px]">
            <Tabs
              items={TAB_KEYS.map((key) => t(`tabs.${key}.label`))}
              active={active}
              onChange={setActive}
            />
          </div>

          <div className="grid min-h-[420px] overflow-hidden rounded-[var(--radius-card)] bg-white lg:grid-cols-2">
            <div className="p-8 sm:p-12">
              <h3 className="mb-4 text-[clamp(1.35rem,2.5vw,1.75rem)] font-bold tracking-[-0.01em] text-[var(--ink)]">
                {t(`tabs.${tabKey}.title`)}
              </h3>
              <p className="mb-7 text-[15px] leading-[1.65] text-[var(--text-body)]">
                {t(`tabs.${tabKey}.body`)}
              </p>
              <Button href="/opportunities" variant="dark" size="sm">
                {t("learnMore")}
              </Button>
            </div>

            <div className="relative min-h-[280px] bg-[repeating-linear-gradient(45deg,var(--bg-section),var(--bg-section)_10px,var(--bg-stripe)_10px,var(--bg-stripe)_20px)]">
              <span className="absolute top-5 right-6 font-mono text-[11px] text-[var(--text-muted)]">
                {t(`tabs.${tabKey}.imagery`)}
              </span>
              <div className="absolute inset-x-7 bottom-7 rounded-[var(--radius-card)] bg-white p-5 shadow-[var(--shadow-panel)]">
                {tabKey === "discover" && (
                  <div>
                    <div className="mb-2 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">
                      {t("panels.opportunities")}
                    </div>
                    <ChecklistRow
                      label={t("panels.discoverRow1")}
                      trailing={<Badge risk="low" />}
                    />
                    <ChecklistRow
                      label={t("panels.discoverRow2")}
                      trailing={<Badge risk="medium" />}
                      divider={false}
                    />
                  </div>
                )}
                {tabKey === "verify" && (
                  <div>
                    <div className="mb-2 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">
                      {t("panels.verification")}
                    </div>
                    <ChecklistRow label={t("panels.verifyRow1")} state="done" />
                    <ChecklistRow label={t("panels.verifyRow2")} state="done" />
                    <ChecklistRow
                      label={t("panels.verifyRow3")}
                      state="approved"
                      divider={false}
                    />
                  </div>
                )}
                {tabKey === "diligence" && (
                  <div className="flex flex-col gap-3">
                    <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">
                      {t("panels.diligenceProgress")}
                    </div>
                    <ProgressBar
                      label={t("panels.legal")}
                      status={t("panels.signedOff")}
                      value={100}
                    />
                    <ProgressBar
                      label={t("panels.landTitle")}
                      status={t("panels.inReview")}
                      value={60}
                    />
                  </div>
                )}
                {tabKey === "monitor" && (
                  <div>
                    <div className="mb-2 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">
                      {t("panels.milestones")}
                    </div>
                    <ChecklistRow
                      label={t("panels.landPurchase")}
                      trailing={<Badge tone="accent">{t("panels.completed")}</Badge>}
                    />
                    <ChecklistRow
                      label={t("panels.foundation")}
                      trailing={<Badge tone="neutral">{t("panels.inProgress")}</Badge>}
                      divider={false}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
