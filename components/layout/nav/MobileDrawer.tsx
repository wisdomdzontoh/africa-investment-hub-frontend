"use client";

import { UserButton, useAuth } from "@clerk/nextjs";
import { Menu } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { AfriVestLogo } from "@/components/brand/AfriVestLogo";
import { buttonVariants } from "@/components/ds/Button";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAccount } from "@/lib/api/hooks";
import { dashboardPath } from "@/lib/auth/paths";
import { PRIMARY_NAV } from "@/lib/nav.config";
import { cn } from "@/lib/utils";

export function MobileDrawer() {
  const t = useTranslations("nav");
  const tPanels = useTranslations("nav.panels");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { isLoaded, isSignedIn } = useAuth();
  const { data: account } = useAccount(isSignedIn === true);

  const isActive = (prefixes: string[]) => prefixes.some((p) => pathname.startsWith(p));
  const portalHref = account ? dashboardPath(account.role) : "/onboarding";
  const close = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          className="flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-md)] border border-[var(--ink-border)] text-[var(--ink)] transition-colors hover:border-[var(--accent-border-strong)] hover:text-[var(--accent)] min-[1280px]:hidden"
          aria-label={t("openMenu")}
        >
          <Menu className="size-5" strokeWidth={2.25} aria-hidden />
        </button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="flex w-[min(100vw-2rem,380px)] flex-col gap-0 border-[var(--accent-border)] bg-[var(--bg-page)] p-0"
      >
        <SheetHeader className="border-b border-[var(--accent-border)] px-5 py-4">
          <SheetTitle className="text-left">
            <Link href="/" onClick={close} className="inline-flex items-center no-underline" aria-label="AfriVest home">
              <AfriVestLogo height={26} />
            </Link>
          </SheetTitle>
        </SheetHeader>

        <nav className="flex-1 overflow-y-auto px-4 py-3" aria-label={t("mobileNavLabel")}>
          <Accordion type="single" collapsible className="w-full">
            {PRIMARY_NAV.map((section) => {
              const active = isActive(section.matchPrefixes);

              if (section.type === "link") {
                return (
                  <Link
                    key={section.key}
                    href={section.href}
                    onClick={close}
                    aria-current={active ? "true" : undefined}
                    className={cn(
                      "flex min-h-11 items-center rounded-lg px-2.5 py-2.5 text-sm font-semibold no-underline transition-colors",
                      active ? "text-[var(--accent)]" : "text-[var(--ink)] hover:bg-[var(--ink-hover-tint)]",
                    )}
                  >
                    {t(section.key)}
                  </Link>
                );
              }

              return (
                <AccordionItem key={section.key} value={section.key} className="border-b-0">
                  <AccordionTrigger className="min-h-11 px-2.5 py-2.5 text-sm font-semibold text-[var(--ink)] no-underline hover:no-underline">
                    {t(section.key)}
                  </AccordionTrigger>
                  <AccordionContent className="px-0">
                    <div className="flex flex-col gap-4 pb-2 pl-2.5">
                      {section.columns.map((col) => (
                        <div key={col.labelKey}>
                          <p className="mb-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">
                            {tPanels(`${section.key}.${col.labelKey}`)}
                          </p>
                          <div className="flex flex-col">
                            {col.items.map((item) => (
                              <Link
                                key={item.key}
                                href={item.href}
                                onClick={close}
                                className={cn(
                                  "flex min-h-11 items-center rounded-lg py-2 text-sm no-underline transition-colors hover:bg-[var(--ink-hover-tint)]",
                                  item.isViewAll
                                    ? "font-semibold text-[var(--accent)] hover:text-[var(--accent-bright)]"
                                    : "text-[var(--text-body)] hover:text-[var(--ink)]",
                                )}
                              >
                                {item.labelText ?? tPanels(`${section.key}.${item.key}.title`)}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </nav>

        <div className="border-t border-[var(--accent-border)] px-5 py-4">
          <div className="flex flex-col gap-2.5">
            {isLoaded && !isSignedIn && (
              <>
                <Link
                  href="/sign-up"
                  onClick={close}
                  className={cn(buttonVariants({ variant: "dark", size: "lg" }), "w-full !rounded-full")}
                >
                  {t("getStarted")}
                </Link>
                <Link
                  href="/sign-in"
                  onClick={close}
                  className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full !rounded-full")}
                >
                  {t("signIn")}
                </Link>
                <Link
                  href="/contact?intent=advisor"
                  onClick={close}
                  className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full !rounded-full")}
                >
                  {t("talkToAdvisor")}
                </Link>
              </>
            )}
            {isLoaded && isSignedIn && (
              <>
                <Link
                  href={portalHref}
                  onClick={close}
                  className={cn(buttonVariants({ variant: "dark", size: "lg" }), "w-full !rounded-full")}
                >
                  {t("dashboard")}
                </Link>
                <div className="flex items-center gap-2 px-1 py-1 font-mono text-xs text-[var(--text-muted)]">
                  <UserButton /> {t("account")}
                </div>
              </>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-[var(--accent-border)] pt-4">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">
              {t("language")}
            </span>
            <LanguageSwitcher />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
