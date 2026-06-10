"use client";

import { UserButton, useAuth } from "@clerk/nextjs";
import {
  Compass,
  Globe2,
  Info,
  Mail,
  Menu,
  Send,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { Logo } from "@/components/brand/Logo";
import { buttonVariants } from "@/components/ds/Button";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
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

const NAV_ITEMS: { href: string; key: string; icon: LucideIcon }[] = [
  { href: "/opportunities", key: "opportunities", icon: Compass },
  { href: "/countries", key: "countries", icon: Globe2 },
  { href: "/why-africa", key: "whyAfrica", icon: TrendingUp },
  { href: "/about", key: "about", icon: Info },
  { href: "/contact", key: "contact", icon: Mail },
];

export function MobileNav() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { isLoaded, isSignedIn } = useAuth();
  const { data: account } = useAccount(isSignedIn === true);

  const linkActive = (href: string) => pathname.startsWith(href);
  const portalHref = account ? dashboardPath(account.role) : "/onboarding";
  const close = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          className="topnav-menu-btn min-[1024px]:hidden"
          aria-label={t("openMenu")}
        >
          <Menu className="size-5" strokeWidth={2.25} aria-hidden />
        </button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="flex w-[min(100vw-2rem,360px)] flex-col gap-0 border-[var(--accent-border)] bg-[var(--bg-page)] p-0"
      >
        <SheetHeader className="border-b border-[var(--accent-border)] px-5 py-4">
          <SheetTitle className="text-left">
            <Link href="/" onClick={close} className="inline-flex items-center no-underline" aria-label="African Investment Hub home">
              <Logo height={32} priority={false} />
            </Link>
          </SheetTitle>
        </SheetHeader>

        <nav
          className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 py-4"
          aria-label="Mobile"
        >
          {NAV_ITEMS.map(({ href, key, icon: Icon }) => {
            const active = linkActive(href);
            return (
              <Link
                key={key}
                href={href}
                onClick={close}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-3 text-sm font-medium no-underline transition-colors",
                  active
                    ? "bg-[var(--accent-tint-08)] text-[var(--accent)]"
                    : "text-[var(--text-body)] hover:bg-[var(--ink-hover-tint)]",
                )}
              >
                <Icon
                  className="size-[1.15rem]"
                  strokeWidth={2}
                  style={{ color: active ? "var(--accent)" : "var(--text-muted)" }}
                  aria-hidden
                />
                {t(key)}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-[var(--accent-border)] px-5 py-4">
          <div className="mb-4 flex items-center justify-between">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">
              {t("language")}
            </span>
            <LanguageSwitcher />
          </div>

          <div className="flex flex-col gap-2.5">
            {isLoaded && !isSignedIn && (
              <>
                <Link
                  href="/sign-up"
                  onClick={close}
                  className={cn(buttonVariants({ size: "lg" }), "w-full gap-1.5")}
                >
                  <Send className="size-3.5" aria-hidden />
                  {t("submitProject")}
                </Link>
                <Link
                  href="/sign-up"
                  onClick={close}
                  className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full")}
                >
                  {t("register")}
                </Link>
                <Link
                  href="/sign-in"
                  onClick={close}
                  className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full")}
                >
                  {t("signIn")}
                </Link>
              </>
            )}
            {isLoaded && isSignedIn && (
              <>
                <Link
                  href={portalHref}
                  onClick={close}
                  className={cn(buttonVariants({ size: "lg" }), "w-full")}
                >
                  {t("dashboard")}
                </Link>
                <div className="flex items-center gap-2 px-1 py-1 font-mono text-xs text-[var(--text-muted)]">
                  <UserButton /> {t("account")}
                </div>
              </>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
