"use client";

import { ArrowRight, ChevronDown } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { PANEL_FOOTER_LINKS, PRIMARY_NAV, type NavPanelSection } from "@/lib/nav.config";
import { cn } from "@/lib/utils";

const PANEL_ID = "primary-nav-panel";
const OPEN_DELAY = 120;
const CLOSE_DELAY = 150;

function ColumnLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">
      {children}
    </p>
  );
}

function PanelColumns({ section, onNavigate }: { section: NavPanelSection; onNavigate: () => void }) {
  const t = useTranslations(`nav.panels.${section.key}`);

  return (
    <div
      className="grid gap-10 p-10"
      style={{ gridTemplateColumns: `repeat(${section.columns.length}, minmax(0, 1fr))` }}
    >
      {section.columns.map((col) => (
        <div key={col.labelKey}>
          <ColumnLabel>{t(col.labelKey)}</ColumnLabel>
          <div className="flex flex-col gap-1">
            {col.items.map((item) =>
              item.isViewAll ? (
                <Link
                  key={item.key}
                  href={item.href}
                  onClick={onNavigate}
                  className="mt-1 inline-flex items-center gap-1.5 rounded-[var(--radius-md)] py-2 text-[15px] font-semibold text-[var(--accent)] no-underline transition-colors hover:text-[var(--accent-bright)]"
                >
                  {t(`${item.key}.title`)}
                  <ArrowRight size={15} aria-hidden />
                </Link>
              ) : (
                <Link
                  key={item.key}
                  href={item.href}
                  onClick={onNavigate}
                  className="rounded-[var(--radius-md)] py-2 text-[15px] font-medium text-[var(--text-body)] no-underline transition-colors hover:text-[var(--accent)]"
                >
                  {item.labelText ?? t(`${item.key}.title`)}
                </Link>
              ),
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function PanelFooter({ onNavigate }: { onNavigate: () => void }) {
  const t = useTranslations("nav.footerLinks");
  return (
    <div className="flex flex-wrap items-center gap-6 border-t border-[var(--accent-border)] bg-[var(--bg-section)] px-8 py-4">
      {PANEL_FOOTER_LINKS.map(({ key, href, icon: Icon }) => (
        <Link
          key={key}
          href={href}
          onClick={onNavigate}
          className="inline-flex items-center gap-2 text-xs font-medium text-[var(--text-body)] no-underline transition-colors hover:text-[var(--accent)]"
        >
          <Icon size={14} aria-hidden />
          {t(key)}
        </Link>
      ))}
    </div>
  );
}

/** Dim + blur behind an open panel. Portaled to <body> so it always covers the
 *  full viewport regardless of any transform on an ancestor (e.g. the header's
 *  own mount animation), and lives on its own layer instead of a body filter
 *  so it never touches scroll performance. */
function PanelOverlay({ reduced, onClick }: { reduced: boolean; onClick: () => void }) {
  if (typeof document === "undefined") return null;
  return createPortal(
    <motion.div
      aria-hidden
      onClick={onClick}
      className={cn("fixed inset-0 z-30 bg-black/40", !reduced && "backdrop-blur-[4px]")}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduced ? 0 : 0.16 }}
    />,
    document.body,
  );
}

export function PrimaryNav() {
  const pathname = usePathname();
  // Remounting on pathname change resets state (closes whatever panel is
  // open) without an effect driving setState.
  return <PrimaryNavInner key={pathname} pathname={pathname} />;
}

/**
 * Hand-rolled disclosure rather than Radix's NavigationMenu.Content/Viewport:
 * that primitive renders one Content per trigger, and swapping between two
 * open triggers briefly mounted both panels on top of each other (visible as
 * flicker/jitter). Rendering a single shared panel outside the trigger loop,
 * driven by one `value` state, avoids that entirely. Trigger semantics
 * (aria-expanded/aria-controls/haspopup) and the open/close/hover-intent/
 * outside-click/Escape/arrow-key behavior are implemented directly here —
 * this mirrors the hover cancel/schedule pattern this codebase already used
 * for the old single-panel Explore menu, generalized to three triggers with
 * a shared "only one open" state.
 */
function PrimaryNavInner({ pathname }: { pathname: string }) {
  const t = useTranslations("nav");
  const reduced = useReducedMotion() ?? false;
  const [value, setValue] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = () => {
    if (openTimer.current) clearTimeout(openTimer.current);
    if (closeTimer.current) clearTimeout(closeTimer.current);
    openTimer.current = null;
    closeTimer.current = null;
  };
  const openNow = (key: string) => {
    clearTimers();
    setValue(key);
  };
  const closeNow = () => {
    clearTimers();
    setValue("");
  };
  const scheduleOpen = (key: string) => {
    clearTimers();
    openTimer.current = setTimeout(() => setValue(key), OPEN_DELAY);
  };
  const scheduleClose = () => {
    clearTimers();
    closeTimer.current = setTimeout(() => setValue(""), CLOSE_DELAY);
  };

  useEffect(() => clearTimers, []);

  useEffect(() => {
    if (!value) return;
    const onDocPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) closeNow();
    };
    document.addEventListener("pointerdown", onDocPointerDown);
    return () => document.removeEventListener("pointerdown", onDocPointerDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // Global Escape: a panel opened by hover (no focus on its trigger) still
  // has to close on Escape, not just when the trigger itself has focus.
  useEffect(() => {
    if (!value) return;
    const openKey = value;
    const onDocKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      closeNow();
      triggerRefs.current[openKey]?.focus();
    };
    document.addEventListener("keydown", onDocKeyDown);
    return () => document.removeEventListener("keydown", onDocKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const panelSections = PRIMARY_NAV.filter((s): s is NavPanelSection => s.type === "panel");
  const triggerKeys = panelSections.map((s) => s.key);
  const activeSection = panelSections.find((s) => s.key === value);

  const isActive = (prefixes: string[]) => prefixes.some((p) => pathname.startsWith(p));

  const onTriggerKeyDown = (e: React.KeyboardEvent, key: string) => {
    const idx = triggerKeys.indexOf(key);
    if (e.key === "ArrowRight") {
      e.preventDefault();
      triggerRefs.current[triggerKeys[(idx + 1) % triggerKeys.length]]?.focus();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      triggerRefs.current[triggerKeys[(idx - 1 + triggerKeys.length) % triggerKeys.length]]?.focus();
    }
    // Escape is handled globally (see effect above) so it also works when the
    // panel was opened by hover rather than by focusing this trigger.
  };

  return (
    <div
      ref={rootRef}
      className="hidden min-[1280px]:flex min-[1280px]:flex-1"
      onMouseLeave={() => value && scheduleClose()}
    >
      <div role="menubar" aria-label="Main" className="flex shrink-0 items-center gap-0.5">
        {PRIMARY_NAV.map((section) => {
          const active = isActive(section.matchPrefixes);

          if (section.type === "link") {
            return (
              <Link
                key={section.key}
                href={section.href}
                aria-current={active ? "true" : undefined}
                onMouseEnter={closeNow}
                className={cn(
                  "inline-flex items-center whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium text-[var(--ink)] no-underline transition-colors",
                  active ? "bg-[var(--bg-section)]" : "hover:bg-[var(--ink-hover-tint)]",
                )}
              >
                {t(section.key)}
              </Link>
            );
          }

          const open = value === section.key;
          return (
            <button
              key={section.key}
              ref={(el) => {
                triggerRefs.current[section.key] = el;
              }}
              type="button"
              aria-expanded={open}
              aria-haspopup="true"
              aria-controls={PANEL_ID}
              aria-current={active ? "true" : undefined}
              onClick={() => (open ? closeNow() : openNow(section.key))}
              onMouseEnter={() => scheduleOpen(section.key)}
              onKeyDown={(e) => onTriggerKeyDown(e, section.key)}
              className={cn(
                "group/trigger inline-flex items-center gap-1 whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium text-[var(--ink)] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2",
                (open || active) && "bg-[var(--bg-section)]",
                !open && !active && "hover:bg-[var(--ink-hover-tint)]",
              )}
            >
              {t(section.key)}
              <ChevronDown
                size={14}
                aria-hidden
                className={cn("shrink-0 transition-transform duration-200", open && "rotate-180")}
              />
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {activeSection && (
          <motion.div
            key={activeSection.key}
            id={PANEL_ID}
            role="region"
            aria-label={t(activeSection.key)}
            onMouseEnter={clearTimers}
            onMouseLeave={scheduleClose}
            className="absolute inset-x-0 top-full z-50 flex justify-center pt-2.5"
            initial={reduced ? false : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0, transition: { duration: reduced ? 0 : 0.16, ease: "easeOut" } }}
            exit={{ opacity: 0, y: -6, transition: { duration: reduced ? 0 : 0.12, ease: "easeOut" } }}
          >
            <div
              className="shrink-0 overflow-hidden rounded-[var(--radius-panel)] border border-[var(--accent-border)] bg-[var(--surface-card)] shadow-[var(--shadow-panel)]"
              style={{ width: "min(1440px, calc(100vw - 3rem))" }}
            >
              <PanelColumns section={activeSection} onNavigate={closeNow} />
              <PanelFooter onNavigate={closeNow} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {value !== "" && <PanelOverlay reduced={reduced} onClick={closeNow} />}
    </div>
  );
}
