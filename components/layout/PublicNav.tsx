import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { AfriVestLogo } from "@/components/brand/AfriVestLogo";
import { HeaderAuthActions } from "@/components/layout/nav/HeaderAuthActions";
import { HeaderChrome } from "@/components/layout/nav/HeaderChrome";
import { MobileDrawer } from "@/components/layout/nav/MobileDrawer";
import { PrimaryNav } from "@/components/layout/nav/PrimaryNav";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";

export async function PublicNav() {
  const t = await getTranslations("nav");

  return (
    <>
      {/* Plain anchor, not next-intl's <Link> — this is an in-page jump to
          #main-content (added on the marketing layout's <main>), not a route
          navigation, so it doesn't need locale-prefix handling. */}
      <a
        href="#main-content"
        className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-3 focus-visible:top-3 focus-visible:z-[100] focus-visible:rounded-[var(--radius-md)] focus-visible:bg-[var(--ink)] focus-visible:px-4 focus-visible:py-2.5 focus-visible:text-sm focus-visible:font-semibold focus-visible:text-white focus-visible:no-underline"
      >
        {t("skipToContent")}
      </a>

      <HeaderChrome>
        <div className="page relative flex min-h-[84px] flex-nowrap items-center gap-2 py-2">
          <Link
            href="/"
            className="mr-2 inline-flex shrink-0 items-center no-underline"
            aria-label="AfriVest home"
          >
            <AfriVestLogo height={30} />
          </Link>

          <PrimaryNav />

          <div className="ml-auto flex items-center gap-2.5">
            <div className="hidden min-[1280px]:block">
              <LanguageSwitcher />
            </div>
            <HeaderAuthActions />
            <MobileDrawer />
          </div>
        </div>
      </HeaderChrome>
    </>
  );
}
