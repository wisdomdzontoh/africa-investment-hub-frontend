"use client";

import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import { Badge, Card } from "@/components/ds";
import { cn } from "@/lib/utils";

export type ProblemPanelRow = { label: string; status: "high" | "medium" };
export type ProblemItem = {
  key: string;
  label: string;
  desc: string;
  panelTitle: string;
  rows: ProblemPanelRow[];
  /** Placeholder imagery (public/problem/*) — swap for real product/illustration
   *  images later; these are stand-ins only, sized/cropped generically. */
  image: string;
};

const AUTO_ADVANCE_MS = 6000;

function DemoPanel({ item }: { item: ProblemItem }) {
  return (
    <Card hoverLift={false} className="mx-auto w-full max-w-[420px] overflow-hidden" padding="0">
      <div className="relative aspect-[4/3] w-full bg-[var(--bg-section)]">
        <Image
          src={item.image}
          alt=""
          aria-hidden
          fill
          sizes="420px"
          className="object-cover"
        />
      </div>
      <div className="p-5">
        <p className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">
          {item.panelTitle}
        </p>
        <div className="flex flex-col gap-2.5">
          {item.rows.map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between gap-3 rounded-[var(--radius-md)] border border-[var(--accent-border)] bg-[var(--bg-page)] px-3.5 py-3"
            >
              <span className="text-sm font-medium text-[var(--ink)]">{row.label}</span>
              <Badge risk={row.status}>{row.status === "high" ? "Flagged" : "Pending"}</Badge>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

export function ProblemShowcase({ items }: { items: ProblemItem[] }) {
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion() ?? false;

  const goTo = (i: number) => setActive(i);
  const advance = () => setActive((a) => (a + 1) % items.length);

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-14">
      <div className="order-2 lg:order-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={items[active].key}
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <DemoPanel item={items[active]} />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="order-1 flex flex-col lg:order-2">
        {items.map((item, i) => {
          const open = i === active;
          return (
            <div key={item.key} className="border-b border-[var(--accent-border)]">
              <button
                type="button"
                onClick={() => goTo(i)}
                aria-expanded={open}
                className="flex w-full items-center justify-between gap-4 py-4 text-left"
              >
                <span
                  className={cn(
                    "text-base font-semibold transition-colors",
                    open ? "text-[var(--ink)]" : "text-[var(--text-muted)]",
                  )}
                >
                  {item.label}
                </span>
                <ChevronDown
                  size={18}
                  aria-hidden
                  className={cn(
                    "shrink-0 text-[var(--text-muted)] transition-transform duration-200",
                    open && "rotate-180 text-[var(--accent)]",
                  )}
                />
              </button>

              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    initial={reduced ? false : { height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="overflow-hidden"
                  >
                    <p className="pb-4 text-sm leading-relaxed text-[var(--text-body)]">{item.desc}</p>
                    {!reduced && (
                      <div className="mb-4 h-[3px] w-full overflow-hidden rounded-full bg-[var(--bg-section)]">
                        <motion.div
                          key={active}
                          className="h-full rounded-full bg-[var(--accent)]"
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{ duration: AUTO_ADVANCE_MS / 1000, ease: "linear" }}
                          onAnimationComplete={advance}
                        />
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
