import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Card, SectionLabel } from "@/components/ds";

const ITEMS = [
  "discovery",
  "trust",
  "diligence",
  "regulatory",
  "visibility",
  "network",
] as const;

const ICONS: Record<(typeof ITEMS)[number], string> = {
  discovery: "search",
  trust: "alert",
  diligence: "checklist",
  regulatory: "layers",
  visibility: "eye",
  network: "network",
};

function IconWell({ name }: { name: string }) {
  return (
    <div className="mb-5 flex size-11 items-center justify-center rounded-[10px] bg-[var(--accent-tint-08)]">
      <Image src={`/brand/icons/${name}.svg`} width={22} height={22} alt="" aria-hidden />
    </div>
  );
}

export async function ProblemSection() {
  const t = await getTranslations("home.problem");

  return (
    <section className="bg-[var(--bg-page)] py-[clamp(3rem,7vw,7.5rem)]">
      <div className="page">
        <div className="mx-auto mb-16 max-w-[680px] text-center">
          <div className="mb-4">
            <SectionLabel>{t("eyebrow")}</SectionLabel>
          </div>
          <h2 className="text-balance text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.15] tracking-[-0.02em] text-[var(--ink)]">
            {t("title")}
          </h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ITEMS.map((key) => (
            <Card key={key}>
              <IconWell name={ICONS[key]} />
              <h3 className="mb-2.5 text-lg font-semibold text-[var(--ink)]">
                {t(`items.${key}.label`)}
              </h3>
              <p className="m-0 text-[15px] leading-relaxed text-[var(--text-body)]">
                {t(`items.${key}.desc`)}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
