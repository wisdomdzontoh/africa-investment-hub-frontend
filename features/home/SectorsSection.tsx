import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SectionHead } from "@/components/common/SectionHead";
import { SectorGlyph } from "@/components/common/SectorGlyph";
import { getSectors } from "@/lib/data/sectors";

export async function SectorsSection() {
  const t = await getTranslations("home.sectors");
  const sectors = await getSectors();

  return (
    <section className="page py-14 pb-6">
      <SectionHead eyebrow={t("eyebrow")} title={t("title")} />
      <div className="sector-grid mt-7">
        {sectors.map((s) => (
          <Link
            key={s.id}
            href={`/opportunities?sector=${s.id}`}
            className="sector-tile no-underline"
          >
            <SectorGlyph id={s.id} size={44} />
            <span className="text-[var(--text-sm)] font-semibold text-[var(--text-strong)]">
              {s.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
