"use client";

import { UserButton } from "@clerk/nextjs";
import {
  BarChart3,
  Briefcase,
  Globe,
  GitMerge,
  Home,
  LayoutDashboard,
  type LucideIcon,
  ScrollText,
  UserCog,
  Users,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Logo } from "@/components/brand/Logo";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type NavItem = {
  href?: string;
  labelKey: string;
  icon: LucideIcon;
  exact?: boolean;
  soon?: boolean;
};

const NAV_GROUPS: { groupKey: string; items: NavItem[] }[] = [
  {
    groupKey: "navOperations",
    items: [
      { href: "/admin", labelKey: "overview", icon: LayoutDashboard, exact: true },
      { href: "/admin/investors", labelKey: "investors", icon: Users },
      { href: "/admin/projects", labelKey: "projects", icon: Briefcase },
      { href: "/admin/users", labelKey: "users", icon: UserCog },
      { href: "/admin/audit-log", labelKey: "auditLog", icon: ScrollText },
    ],
  },
  {
    groupKey: "navComingSoon",
    items: [
      { labelKey: "navMatches", icon: GitMerge, soon: true },
      { labelKey: "navCountries", icon: Globe, soon: true },
      { labelKey: "navHomepage", icon: Home, soon: true },
      { labelKey: "navAnalytics", icon: BarChart3, soon: true },
    ],
  },
];

const OPERATIONS = NAV_GROUPS[0].items;

export function AdminShell({ children }: { children: React.ReactNode }) {
  const t = useTranslations("adminPortal");
  const pathname = usePathname();

  const isActive = (item: NavItem) =>
    item.href
      ? item.exact
        ? pathname === item.href
        : pathname === item.href || pathname.startsWith(`${item.href}/`)
      : false;

  return (
    <div className="flex min-h-screen flex-col bg-[var(--surface-page)]">
      {/* Topbar */}
      <header className="sticky top-0 z-30 border-b border-border bg-[var(--surface-header)]/95 backdrop-blur">
        <div className="flex h-14 items-center gap-3 px-4 sm:px-6">
          <Link href="/admin" className="shrink-0" aria-label="Admin home">
            <Logo height={28} />
          </Link>
          <span className="hidden rounded-full border border-border px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:inline">
            {t("consoleLabel")}
          </span>
          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <Link
              href="/"
              className="hidden text-sm text-muted-foreground hover:text-foreground sm:inline"
            >
              {t("backToSite")}
            </Link>
            <LanguageSwitcher />
            <UserButton />
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[1400px] flex-1 lg:grid lg:grid-cols-[244px_1fr]">
        {/* Sidebar (desktop) */}
        <aside className="hidden border-r border-border bg-background/40 lg:block">
          <nav className="sticky top-14 flex flex-col gap-6 p-4">
            {NAV_GROUPS.map((group) => (
              <div key={group.groupKey}>
                <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {t(group.groupKey)}
                </p>
                <div className="flex flex-col gap-0.5">
                  {group.items.map((item) => (
                    <NavLink key={item.labelKey} item={item} active={isActive(item)} t={t} />
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </aside>

        {/* Main */}
        <main className="min-w-0 px-4 py-6 sm:px-6 lg:px-8">
          {/* Mobile nav */}
          <div className="mb-5 flex gap-1.5 overflow-x-auto pb-1 lg:hidden">
            {OPERATIONS.map((item) => (
              <Link
                key={item.labelKey}
                href={item.href ?? "/admin"}
                className={cn(
                  "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors",
                  isActive(item)
                    ? "border-[var(--green-600)] bg-[color-mix(in_srgb,var(--green-600)_12%,transparent)] font-medium text-[var(--green-700)]"
                    : "border-border bg-background text-muted-foreground",
                )}
              >
                <item.icon className="size-4" aria-hidden />
                {t(item.labelKey)}
              </Link>
            ))}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}

function NavLink({
  item,
  active,
  t,
}: {
  item: NavItem;
  active: boolean;
  t: (k: string) => string;
}) {
  const Icon = item.icon;
  const base =
    "flex items-center gap-2.5 rounded-[var(--radius-base)] px-3 py-2 text-sm transition-colors";

  if (item.soon || !item.href) {
    return (
      <span className={cn(base, "cursor-default text-muted-foreground/60")}>
        <Icon className="size-4" aria-hidden />
        <span className="flex-1">{t(item.labelKey)}</span>
        <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-semibold uppercase text-muted-foreground">
          {t("soon")}
        </span>
      </span>
    );
  }

  return (
    <Link
      href={item.href}
      className={cn(
        base,
        active
          ? "bg-[color-mix(in_srgb,var(--green-600)_12%,transparent)] font-medium text-[var(--green-700)]"
          : "text-foreground/80 hover:bg-muted hover:text-foreground",
      )}
    >
      <Icon className="size-4" aria-hidden />
      {t(item.labelKey)}
    </Link>
  );
}
