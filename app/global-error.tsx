"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

// Root-level error boundary. It replaces the entire root layout, so neither
// globals.css nor the next/font variables are available here — styles are
// inlined with literal DS token values (cream #FDF6F0, ink #1A1A1A,
// accent #C0392B). Copy is plain English since this lives outside the locale
// provider.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
    console.error(error);
  }, [error]);

  const btnBase: React.CSSProperties = {
    fontFamily: "'Noto Sans Mono', ui-monospace, monospace",
    fontSize: 14,
    fontWeight: 600,
    padding: "13px 26px",
    borderRadius: 8,
    cursor: "pointer",
    textDecoration: "none",
    lineHeight: 1,
  };

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#FDF6F0",
          color: "#1A1A1A",
          fontFamily: "Inter, system-ui, -apple-system, sans-serif",
          padding: 24,
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 480 }}>
          <p
            style={{
              fontFamily: "'Noto Sans Mono', ui-monospace, monospace",
              fontSize: 12,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#C0392B",
              margin: 0,
            }}
          >
            Something went wrong
          </p>
          <h1
            style={{
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 1.12,
              margin: "16px 0 0",
            }}
          >
            An unexpected error occurred
          </h1>
          <p
            style={{
              fontSize: 17,
              lineHeight: 1.6,
              color: "#4A4A4A",
              margin: "16px 0 0",
            }}
          >
            We hit a problem loading the application. Please try again.
          </p>
          <div
            style={{
              marginTop: 28,
              display: "flex",
              gap: 12,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              onClick={() => reset()}
              style={{ ...btnBase, background: "#C0392B", color: "#fff", border: "none" }}
            >
              Try again
            </button>
            {/* global-error replaces the root layout and renders outside the
                router/provider tree, so next/link's <Link> can't be used here —
                a full-document navigation is intentional. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/"
              style={{
                ...btnBase,
                background: "transparent",
                color: "#1A1A1A",
                border: "1.5px solid #1A1A1A",
              }}
            >
              Back to home
            </a>
          </div>
          {error.digest && (
            <p
              style={{
                marginTop: 20,
                fontFamily: "'Noto Sans Mono', ui-monospace, monospace",
                fontSize: 12,
                color: "#8A8A8A",
              }}
            >
              Ref: {error.digest}
            </p>
          )}
        </div>
      </body>
    </html>
  );
}
