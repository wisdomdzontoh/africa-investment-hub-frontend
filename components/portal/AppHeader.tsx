"use client";

import { UserButton } from "@clerk/nextjs";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Link, usePathname } from "@/i18n/navigation";
import { NotificationBell } from "@/components/portal/NotificationBell";
import type { PortalNavGroup } from "@/components/portal/AppSidebar";

export function AppHeader({
  title,
  homeHref,
  nav,
}: {
  title: string;
  homeHref: string;
  nav: PortalNavGroup[];
}) {
  const pathname = usePathname();
  const flat = nav.flatMap((g) => g.items).filter((i) => i.href);
  const active = flat.find((i) =>
    i.exact ? pathname === i.href : pathname === i.href || pathname.startsWith(`${i.href}/`),
  );

  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-2 border-b border-[var(--p-border)] bg-[color-mix(in_srgb,var(--p-surface)_92%,transparent)] px-3 backdrop-blur sm:px-4">
      <SidebarTrigger className="text-[var(--text-body)]" />
      <Separator orientation="vertical" className="mr-1 hidden h-5 sm:block" />

      <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-2">
        <Link
          href={homeHref}
          className="truncate text-sm font-semibold text-[var(--ink)] no-underline hover:text-[var(--accent)]"
        >
          {title}
        </Link>
        {active && active.label !== title ? (
          <>
            <span className="text-[var(--text-muted)]" aria-hidden>
              /
            </span>
            <span className="truncate text-sm text-[var(--text-muted)]">{active.label}</span>
          </>
        ) : null}
      </nav>

      <div className="ml-auto flex items-center gap-1 sm:gap-1.5">
        <NotificationBell />
        <LanguageSwitcher />
        <Separator orientation="vertical" className="mx-0.5 hidden h-5 sm:block" />
        <UserButton />
      </div>
    </header>
  );
}
