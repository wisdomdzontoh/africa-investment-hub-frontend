"use client";

import { useTranslations } from "next-intl";
import { BrandedCard } from "@/components/brand/Card";
import { useAccount, useMyProjects } from "@/lib/api/hooks";

export default function ProjectOwnerOverviewPage() {
  const t = useTranslations("ownerPortal");
  const { data: account } = useAccount();
  const { data: projects } = useMyProjects();

  return (
    <BrandedCard className="p-6">
      <h2 className="font-semibold">{t("welcome")}</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        {t("statusLabel")}: {account?.status}
      </p>
      <p className="mt-2 text-sm text-muted-foreground">
        {t("projectCount")}: {projects?.length ?? 0}
      </p>
    </BrandedCard>
  );
}
