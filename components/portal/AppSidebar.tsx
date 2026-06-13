"use client";

import type { LucideIcon } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Link, usePathname } from "@/i18n/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useAccount } from "@/lib/api/hooks";
import { StatusPill } from "@/components/portal/StatusPill";

export type PortalNavItem = {
  href?: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
  soon?: boolean;
};
export type PortalNavGroup = { label?: string; items: PortalNavItem[] };

type AppSidebarProps = {
  homeHref: string;
  title: string;
  nav: PortalNavGroup[];
  soonLabel?: string;
};

/** Compact brand mark shown when the sidebar collapses to the icon rail
 *  (DS logo mark: terracotta rounded square + white Inter-800 "A"). */
function BrandMark() {
  return (
    <span className="flex size-7 items-center justify-center rounded-[7px] bg-[var(--accent)] font-sans text-sm font-extrabold leading-none text-white">
      A
    </span>
  );
}

export function AppSidebar({ homeHref, title, nav, soonLabel }: AppSidebarProps) {
  const pathname = usePathname();
  const { data: account } = useAccount();

  const isActive = (item: PortalNavItem) =>
    item.href
      ? item.exact
        ? pathname === item.href
        : pathname === item.href || pathname.startsWith(`${item.href}/`)
      : false;

  return (
    <Sidebar collapsible="icon" className="border-[var(--p-border)] bg-[var(--p-surface)]">
      <SidebarHeader className="h-16 justify-center px-3">
        <Link
          href={homeHref}
          aria-label={title}
          className="flex items-center gap-2 no-underline"
        >
          <span className="group-data-[collapsible=icon]:hidden">
            <Logo height={30} />
          </span>
          <span className="hidden group-data-[collapsible=icon]:flex">
            <BrandMark />
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {nav.map((group, gi) => (
          <SidebarGroup key={group.label ?? gi}>
            {group.label ? <SidebarGroupLabel>{group.label}</SidebarGroupLabel> : null}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  if (item.soon || !item.href) {
                    return (
                      <SidebarMenuItem key={item.label}>
                        <SidebarMenuButton disabled tooltip={item.label}>
                          <Icon />
                          <span>{item.label}</span>
                        </SidebarMenuButton>
                        {soonLabel ? <SidebarMenuBadge>{soonLabel}</SidebarMenuBadge> : null}
                      </SidebarMenuItem>
                    );
                  }
                  return (
                    <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton asChild isActive={isActive(item)} tooltip={item.label}>
                        <Link href={item.href}>
                          <Icon />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="group-data-[collapsible=icon]:hidden">
        {account ? (
          <div className="flex items-center justify-between gap-2 rounded-[var(--radius-md)] border border-[var(--p-border)] bg-[var(--p-muted)] px-3 py-2">
            <span className="truncate font-mono text-[11px] uppercase tracking-[0.06em] text-[var(--text-muted)]">
              {account.role.replace(/_/g, " ")}
            </span>
            <StatusPill status={account.status} />
          </div>
        ) : null}
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
