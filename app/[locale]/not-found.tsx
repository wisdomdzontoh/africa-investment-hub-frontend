import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { BrandedButton } from "@/components/brand/Button";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <div className="page flex min-h-[50vh] flex-col items-center justify-center py-20 text-center">
      <h1 className="display-2">{t("title")}</h1>
      <p className="lead mt-3 max-w-md">{t("body")}</p>
      <BrandedButton asChild className="mt-6">
        <Link href="/">{t("home")}</Link>
      </BrandedButton>
    </div>
  );
}
