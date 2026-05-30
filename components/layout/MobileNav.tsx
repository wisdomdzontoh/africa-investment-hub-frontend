"use client";

import { UserButton, useAuth } from "@clerk/nextjs";
import { Menu } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { BrandedButton } from "@/components/brand/Button";
import { Logo } from "@/components/brand/Logo";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAccount } from "@/lib/api/hooks";
import { dashboardPath } from "@/lib/auth/paths";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", key: "home" as const },
  { href: "/opportunities", key: "opportunities" as const },
  { href: "/countries", key: "countries" as const },
  { href: "/why-africa", key: "whyAfrica" as const },
  { href: "/about", key: "about" as const },
  { href: "/contact", key: "contact" as const },
];

export function MobileNav() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { isLoaded, isSignedIn } = useAuth();
  const { data: account } = useAccount(isSignedIn === true);

  const linkActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));
  const portalHref = account ? dashboardPath(account.role) : "/onboarding";
  const close = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {/* Trigger is mobile/tablet only — desktop uses the inline nav. */}
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="topnav-menu-btn min-[900px]:hidden"
          aria-label={t("openMenu")}
        >
          <Menu className="size-5" strokeWidth={2.25} aria-hidden />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[min(100vw-2rem,320px)]">
        <SheetHeader>
          <SheetTitle className="text-left">
            <Logo height={32} />
          </SheetTitle>
        </SheetHeader>

        <nav className="mt-6 flex flex-col gap-1" aria-label="Mobile">
          {NAV_ITEMS.map(({ href, key }) => (
            <Link
              key={key}
              href={href}
              onClick={close}
              className={cn(
                "rounded-[var(--radius-base)] px-3 py-2.5 text-sm font-semibold no-underline",
                linkActive(href)
                  ? "bg-muted text-[var(--orange-deep)]"
                  : "text-[var(--text-strong)] hover:bg-muted",
              )}
            >
              {t(key)}
            </Link>
          ))}
        </nav>

        <div className="mt-6 flex items-center justify-between border-t border-border pt-6">
          <span className="text-sm text-muted-foreground">{t("language")}</span>
          <LanguageSwitcher />
        </div>

        <div className="mt-6 flex flex-col gap-3 border-t border-border pt-6">
          {isLoaded && !isSignedIn && (
            <>
              <Link href="/sign-in" onClick={close}>
                <BrandedButton variant="outline" className="w-full">
                  {t("signIn")}
                </BrandedButton>
              </Link>
              <Link href="/sign-up" onClick={close}>
                <BrandedButton className="w-full">{t("register")}</BrandedButton>
              </Link>
            </>
          )}
          {isLoaded && isSignedIn && (
            <>
              <Link href={portalHref} onClick={close}>
                <BrandedButton className="w-full">{t("dashboard")}</BrandedButton>
              </Link>
              <div className="flex items-center gap-2 px-1 text-sm text-muted-foreground">
                <UserButton /> {t("account")}
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
