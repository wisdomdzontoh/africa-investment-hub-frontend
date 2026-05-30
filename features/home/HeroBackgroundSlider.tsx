"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

// Local, build-optimized imagery reflecting the platform's sectors:
// finance, urban real estate, energy infrastructure, housing, architecture.
const SLIDES = [
  "/hero/hero-1-finance.jpg",
  "/hero/hero-2-skyline.jpg",
  "/hero/hero-3-energy.jpg",
  "/hero/hero-4-housing.jpg",
  "/hero/hero-5-architecture.jpg",
];

const INTERVAL_MS = 5500;

export function HeroBackgroundSlider() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(
      () => setActive((a) => (a + 1) % SLIDES.length),
      INTERVAL_MS,
    );
    return () => clearInterval(id);
  }, [paused]);

  return (
    <div
      className="hero-bg"
      aria-hidden="true"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {SLIDES.map((src, i) => (
        <div
          key={src}
          className={`hero-bg-slide${i === active ? " is-active" : ""}`}
        >
          <Image
            src={src}
            alt=""
            fill
            priority={i === 0}
            sizes="100vw"
            className="hero-bg-img"
          />
        </div>
      ))}
      <div className="hero-bg-dots">
        {SLIDES.map((src, i) => (
          <button
            key={src}
            type="button"
            tabIndex={-1}
            className={i === active ? "is-active" : ""}
            onClick={() => setActive(i)}
            aria-label={`Show background ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
