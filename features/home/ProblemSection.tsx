import { getTranslations } from "next-intl/server";
import { SectionLabel } from "@/components/ds";
import { ProblemShowcase, type ProblemItem, type ProblemPanelRow } from "@/features/home/ProblemShowcase";

const ITEM_KEYS = [
  "discovery",
  "trust",
  "diligence",
  "regulatory",
  "visibility",
  "network",
] as const;

// Placeholder imagery (public/problem/*) standing in for the real thing —
// see ProblemItem["image"] for the swap-out note.
const ITEM_IMAGES: Record<(typeof ITEM_KEYS)[number], string> = {
  discovery: "/problem/discovery.png",
  trust: "/problem/trust-and-fraud.png",
  diligence: "/problem/due-diligence.png",
  regulatory: "/problem/regulatory-opacity.png",
  visibility: "/problem/post-investment.png",
  network: "/problem/network-gap.png",
};

export async function ProblemSection() {
  const t = await getTranslations("home.problem");

  const items: ProblemItem[] = ITEM_KEYS.map((key) => {
    const panel = t.raw(`items.${key}.panel`) as { title: string; rows: ProblemPanelRow[] };
    return {
      key,
      label: t(`items.${key}.label`),
      desc: t(`items.${key}.desc`),
      panelTitle: panel.title,
      rows: panel.rows,
      image: ITEM_IMAGES[key],
    };
  });

  return (
    <section className="bg-[var(--bg-page)] py-[clamp(3rem,7vw,7.5rem)]">
      <div className="page">
        <div className="mx-auto mb-14 max-w-[680px] text-center">
          <div className="mb-4">
            <SectionLabel>{t("eyebrow")}</SectionLabel>
          </div>
          <h2 className="text-balance text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.15] tracking-[-0.02em] text-[var(--ink)]">
            {t("title")}
          </h2>
        </div>

        <ProblemShowcase items={items} />
      </div>
    </section>
  );
}
