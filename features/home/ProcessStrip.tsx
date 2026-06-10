import { Compass, ShieldCheck, UserPlus } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Card } from "@/components/ds";

const STEPS = [
  { key: "register", icon: UserPlus },
  { key: "verify", icon: ShieldCheck },
  { key: "invest", icon: Compass },
] as const;

export async function ProcessStrip() {
  const t = await getTranslations("home.process");

  return (
    <section className="bg-[var(--bg-page)] py-14">
      <div className="page grid gap-6 md:grid-cols-3">
        {STEPS.map(({ key, icon: Icon }, i) => (
          <Card key={key} hoverLift={false} className="relative">
            <span className="mb-4 inline-flex size-8 items-center justify-center rounded-full bg-[var(--accent-tint-08)] font-mono text-xs font-bold text-[var(--accent)]">
              {i + 1}
            </span>
            <span className="mb-3 flex size-11 items-center justify-center rounded-[10px] bg-[var(--accent-tint-08)] text-[var(--accent)]">
              <Icon size={22} aria-hidden />
            </span>
            <h3 className="text-lg font-semibold text-[var(--ink)]">
              {t(`${key}.title`)}
            </h3>
            <p className="m-0 mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
              {t(`${key}.desc`)}
            </p>
          </Card>
        ))}
      </div>
    </section>
  );
}
