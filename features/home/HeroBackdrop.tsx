"use client";

import { useReducedMotion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

// Curated, on-brand cityscape / infrastructure / energy imagery. Treated under
// a heavy cream veil so the brand surface — not the photo — leads. Hybrid
// imagery per DS: real photography, DS treatment.
const IMAGES = [
  "/hero/hero-2-skyline.jpg",
  "/hero/hero-3-energy.jpg",
  "/hero/hero-5-architecture.jpg",
  "/hero/hero-4-housing.jpg",
  "/hero/hero-1-finance.jpg",
];

const INTERVAL = 5500;

export function HeroBackdrop() {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(
      () => setActive((a) => (a + 1) % IMAGES.length),
      INTERVAL,
    );
    return () => clearInterval(id);
  }, [reduced]);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {IMAGES.map((src, i) => (
        <div
          key={src}
          className={cn(
            "absolute inset-0 transition-opacity duration-[1600ms] ease-[ease]",
            i === active ? "opacity-100" : "opacity-0",
          )}
        >
          <Image
            src={src}
            alt=""
            fill
            sizes="100vw"
            priority={i === 0}
            className={cn(
              "object-cover transition-transform ease-[ease] duration-[7000ms]",
              !reduced && i === active ? "scale-[1.08]" : "scale-100",
            )}
          />
        </div>
      ))}

      {/* Cream veil — keeps the warm brand surface dominant and the centred
          ink copy legible. Heavier at the top/bottom seams so the band blends
          into whatever sits above/below it. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, var(--bg-page) 0%, color-mix(in srgb, var(--bg-page) 78%, transparent) 22%, color-mix(in srgb, var(--bg-page) 74%, transparent) 72%, var(--bg-page) 100%)",
        }}
      />
      <div className="absolute inset-0 bg-[color-mix(in_srgb,var(--bg-page)_60%,transparent)]" />
    </div>
  );
}
