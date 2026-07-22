"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  Badge,
  Button,
  ChecklistRow,
  ProgressBar,
  Tabs,
} from "@/components/ds";

const TAB_KEYS = ["discover", "verify", "diligence", "monitor"] as const;

type TabKey = (typeof TAB_KEYS)[number];

// unDraw scenes (MIT-licensed), recolored to the DS palette — one per tab.
const TAB_ART: Record<TabKey, string> = {
  discover: "/illustrations/discover-search.svg",
  verify: "/illustrations/verify-shield.svg",
  diligence: "/illustrations/diligence-review.svg",
  monitor: "/illustrations/monitor-growth.svg",
};

function TabPanel({ tabKey }: { tabKey: TabKey }) {
  const t = useTranslations("home.featureTabs");
  return (
    <>
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
    </>
  );
}

export function FeatureTabsSection() {
  const t = useTranslations("home.featureTabs");
  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion();
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

            <div className="relative min-h-[360px] overflow-hidden bg-[var(--bg-section)]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={tabKey}
                  className="absolute inset-0"
                  initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                  transition={{ duration: 0.28, ease: "easeOut" }}
                >
                  <div className="absolute inset-x-10 top-8 bottom-[8.5rem] sm:inset-x-14">
                    <Image
                      src={TAB_ART[tabKey]}
                      alt=""
                      fill
                      sizes="(max-width: 1024px) 90vw, 45vw"
                      className="object-contain"
                    />
                  </div>
                  <div className="absolute inset-x-7 bottom-7 rounded-[var(--radius-card)] bg-white p-5 shadow-[var(--shadow-panel)]">
                    <TabPanel tabKey={tabKey} />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
