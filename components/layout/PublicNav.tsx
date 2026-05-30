"use client";

import { UserButton, useAuth } from "@clerk/nextjs";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Logo } from "@/components/brand/Logo";
import { BrandedButton } from "@/components/brand/Button";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { MobileNav } from "@/components/layout/MobileNav";
import { cn } from "@/lib/utils";
import { useAccount } from "@/lib/api/hooks";
import { dashboardPath } from "@/lib/auth/paths";

const NAV_ITEMS = [
  { href: "/", key: "home" as const },
  { href: "/opportunities", key: "opportunities" as const },
  { href: "/countries", key: "countries" as const },
  { href: "/why-africa", key: "whyAfrica" as const },
];

export function PublicNav() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const { isLoaded, isSignedIn } = useAuth();
  const { data: account } = useAccount(isSignedIn === true);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const portalHref = account ? dashboardPath(account.role) : "/onboarding";

  return (
    <header className="topnav">
      <div className="topnav-inner">
        <Link
          href="/"
          className="topnav-brand shrink-0"
          aria-label="African Investment Hub home"
        >
          <Logo className="logo-image-header" />
        </Link>

        <nav className="navlinks" aria-label="Main">
          {NAV_ITEMS.map(({ href, key }) => (
            <Link
              key={key}
              href={href}
              className={cn("navlink", isActive(href) && "is-active")}
            >
              {t(key)}
            </Link>
          ))}
        </nav>

        <div className="topnav-actions">
          <LanguageSwitcher />
          <div className="topnav-auth">
            {isLoaded && !isSignedIn && (
              <>
                <Link href="/sign-in">
                  <BrandedButton
                    variant="ghost"
                    size="sm"
                    className="font-semibold text-[var(--text-strong)] hover:bg-muted"
                  >
                    {t("signIn")}
                  </BrandedButton>
                </Link>
                <Link href="/sign-up">
                  <BrandedButton size="sm" className="shadow-sm">
                    {t("register")}
                  </BrandedButton>
                </Link>
              </>
            )}
            {isLoaded && isSignedIn && (
              <>
                <Link href={portalHref}>
                  <BrandedButton variant="ghost" size="sm">
                    {t("dashboard")}
                  </BrandedButton>
                </Link>
                <UserButton />
              </>
            )}
          </div>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
