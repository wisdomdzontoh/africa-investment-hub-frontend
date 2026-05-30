"use client";

import { useTranslations } from "next-intl";
import { BrandedCard } from "@/components/brand/Card";
import { useInvestorNotifications } from "@/lib/api/hooks";

export default function InvestorNotificationsPage() {
  const t = useTranslations("investorPortal");
  const { data, isLoading } = useInvestorNotifications();

  if (isLoading) return <p className="text-muted-foreground">{t("loading")}</p>;

  const items = data?.items ?? [];

  return (
    <div className="grid gap-3">
      {items.length === 0 ? (
        <BrandedCard className="p-6 text-sm text-muted-foreground">{t("noNotifications")}</BrandedCard>
      ) : (
        items.map((n) => (
          <BrandedCard key={n.id} className={`p-4 ${n.is_read ? "opacity-70" : ""}`}>
            <p className="font-medium">{n.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{n.body}</p>
          </BrandedCard>
        ))
      )}
    </div>
  );
}
