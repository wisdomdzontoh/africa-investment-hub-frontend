"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Logo } from "@/components/brand/Logo";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

/** Shared onboarding chrome (role select + wizard): logo · language · exit.
 *  Composed from shadcn primitives to match the portal AppHeader. */
export function OnboardingHeader({
  exitLabel,
  maxWidth = "max-w-5xl",
}: {
  exitLabel: string;
  maxWidth?: string;
}) {
  return (
    <header className="sticky top-0 z-20 border-b border-[var(--accent-border)] bg-[color-mix(in_srgb,var(--surface-header)_92%,transparent)] backdrop-blur">
      <div className={cn("mx-auto flex h-16 w-full items-center justify-between px-4 sm:px-6", maxWidth)}>
        <Link href="/" className="inline-flex" aria-label="African Investment Hub home">
          <Logo height={30} />
        </Link>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <LanguageSwitcher />
          <Separator orientation="vertical" className="mx-0.5 hidden h-5 sm:block" />
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="gap-1.5 text-[var(--text-muted)] hover:text-[var(--ink)]"
          >
            <Link href="/" className="no-underline">
              <X className="size-4" aria-hidden />
              {exitLabel}
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
