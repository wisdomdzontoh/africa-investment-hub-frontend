"use client";

import { UserButton, useAuth } from "@clerk/nextjs";
import { ChevronDown, Compass, Globe2, Send, TrendingUp, type LucideIcon } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ds/Button";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { MobileNav } from "@/components/layout/MobileNav";
import { cn } from "@/lib/utils";
import { useAccount } from "@/lib/api/hooks";
import { dashboardPath } from "@/lib/auth/paths";

const EXPLORE_ITEMS: { href: string; key: "opportunities" | "countries" | "whyAfrica"; icon: LucideIcon }[] = [
  { href: "/opportunities", key: "opportunities", icon: Compass },
  { href: "/countries", key: "countries", icon: Globe2 },
  { href: "/why-africa", key: "whyAfrica", icon: TrendingUp },
];

const SIMPLE_ITEMS = [
  { href: "/about", key: "about" as const },
  { href: "/contact", key: "contact" as const },
];

function ExploreMenu({ active }: { active: boolean }) {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), 140);
  };

  useEffect(() => () => cancelClose(), []);

  return (
    <div
      className="megamenu"
      onMouseEnter={() => {
        cancelClose();
        setOpen(true);
      }}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        className={cn("navlink megamenu-trigger", active && "is-active")}
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((o) => !o)}
      >
        {t("explore")}
        <ChevronDown
          className={cn("megamenu-chevron", open && "is-open")}
          aria-hidden
        />
        {active && (
          <motion.span layoutId="nav-underline" className="navlink-underline" />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="megamenu-panel"
            role="menu"
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
          >
            {EXPLORE_ITEMS.map(({ href, key, icon: Icon }) => (
              <Link
                key={key}
                href={href}
                role="menuitem"
                className="megamenu-link"
                onClick={() => setOpen(false)}
              >
                <span className="megamenu-link-ic">
                  <Icon size={18} aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className="megamenu-link-title">{t(key)}</span>
                  <span className="megamenu-link-desc">
                    {t(`descriptions.${key}`)}
                  </span>
                </span>
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function PublicNav() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const { isLoaded, isSignedIn } = useAuth();
  const { data: account } = useAccount(isSignedIn === true);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => pathname.startsWith(href);
  const exploreActive = EXPLORE_ITEMS.some((i) => isActive(i.href));
  const portalHref = account ? dashboardPath(account.role) : "/onboarding";

  return (
    <motion.header
      className={cn("topnav", scrolled && "is-scrolled")}
      data-scrolled={scrolled}
      initial={reduced ? false : { y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="topnav-inner">
        <Link
          href="/"
          className="topnav-brand shrink-0"
          aria-label="African Investment Hub home"
        >
          <Logo className="logo-image-header" />
        </Link>

        <nav className="navlinks" aria-label="Main">
          <ExploreMenu active={exploreActive} />
          {SIMPLE_ITEMS.map(({ href, key }) => {
            const active = isActive(href);
            return (
              <Link
                key={key}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn("navlink", active && "is-active")}
              >
                {t(key)}
                {active && (
                  <motion.span
                    layoutId="nav-underline"
                    className="navlink-underline"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="topnav-actions">
          <LanguageSwitcher />
          <div className="topnav-auth">
            {!isLoaded && (
              <div className="h-9 w-44 animate-pulse rounded-[var(--radius-md)] bg-[var(--bg-section)]" />
            )}
            {isLoaded && !isSignedIn && (
              <>
                <Button href="/sign-in" variant="outline" size="sm">
                  {t("signIn")}
                </Button>
                <Button href="/sign-up" size="sm" className="gap-1.5">
                  <Send className="size-3.5" aria-hidden />
                  {t("submitProject")}
                </Button>
              </>
            )}
            {isLoaded && isSignedIn && (
              <>
                <Button href={portalHref} variant="outline" size="sm">
                  {t("dashboard")}
                </Button>
                <UserButton />
              </>
            )}
          </div>
          <MobileNav />
        </div>
      </div>
    </motion.header>
  );
}
