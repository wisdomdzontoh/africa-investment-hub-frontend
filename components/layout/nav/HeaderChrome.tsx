"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/** Sticky header wrapper: tracks scroll to add a hairline border + slight blur
 *  past 8px. Never shrinks, hides, or reappears on scroll direction — it just
 *  toggles this one class. Children are server-rendered content passed straight
 *  through, so wrapping them here doesn't pull the rest of the header into the
 *  client bundle. */
export function HeaderChrome({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 bg-[var(--bg-page)] transition-[background-color,border-color,backdrop-filter] duration-200 ease-[ease]",
        scrolled
          ? "border-b border-[var(--accent-border)] bg-[color-mix(in_srgb,var(--bg-page)_97%,transparent)] backdrop-blur-md"
          : "border-b border-transparent",
      )}
    >
      {children}
    </header>
  );
}
