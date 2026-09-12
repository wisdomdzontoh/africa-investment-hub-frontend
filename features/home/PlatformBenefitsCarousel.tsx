"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Card } from "@/components/ds";

const CARD_WIDTH = 300;
const CARD_GAP = 20;

export type PlatformBenefitItem = {
  key: string;
  title: string;
  desc: string;
  image: string;
};

export function PlatformBenefitsCarousel({ items }: { items: PlatformBenefitItem[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const reduced = useReducedMotion() ?? false;

  const updateEdges = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft >= el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    updateEdges();
    const el = scrollerRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateEdges, { passive: true });
    window.addEventListener("resize", updateEdges);
    return () => {
      el.removeEventListener("scroll", updateEdges);
      window.removeEventListener("resize", updateEdges);
    };
  }, [updateEdges]);

  const scrollByCard = (dir: 1 | -1) => {
    scrollerRef.current?.scrollBy({ left: dir * (CARD_WIDTH + CARD_GAP), behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div className="mb-5 flex justify-end gap-2">
        <button
          type="button"
          onClick={() => scrollByCard(-1)}
          disabled={atStart}
          aria-label="Scroll benefits left"
          className="flex size-9 items-center justify-center rounded-full border border-[var(--ink-border)] text-[var(--ink)] transition-colors disabled:opacity-35 hover:not-disabled:border-[var(--accent-border-strong)] hover:not-disabled:text-[var(--accent)]"
        >
          <ArrowLeft size={16} aria-hidden />
        </button>
        <button
          type="button"
          onClick={() => scrollByCard(1)}
          disabled={atEnd}
          aria-label="Scroll benefits right"
          className="flex size-9 items-center justify-center rounded-full border border-[var(--ink-border)] bg-[var(--ink)] text-white transition-colors disabled:opacity-35 hover:not-disabled:bg-[var(--accent)]"
        >
          <ArrowRight size={16} aria-hidden />
        </button>
      </div>

      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item, i) => (
          <Card
            key={item.key}
            hoverLift={false}
            className="shrink-0 snap-start overflow-hidden"
            padding="0"
            style={{ width: CARD_WIDTH }}
          >
            <div className="flex h-[140px] items-center justify-center bg-white">
              <motion.div
                animate={reduced ? undefined : { y: [0, -7, 0] }}
                transition={{
                  duration: 2.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.2,
                }}
              >
                <Image
                  src={item.image}
                  alt=""
                  aria-hidden
                  width={96}
                  height={96}
                  className="size-24 object-contain"
                />
              </motion.div>
            </div>
            <div className="p-5">
              <h3 className="text-lg font-semibold text-[var(--ink)]">{item.title}</h3>
              <p className="m-0 mt-2 text-sm leading-relaxed text-[var(--text-muted)]">{item.desc}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
