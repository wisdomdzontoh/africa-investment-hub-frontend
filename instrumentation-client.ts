// Client-side Sentry init (FE-16). Runs before the app becomes interactive.
// No-ops when NEXT_PUBLIC_SENTRY_DSN is unset (local dev, CI builds).
import * as Sentry from "@sentry/nextjs";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.NEXT_PUBLIC_ENVIRONMENT ?? "development",
    // Performance + session replay are sampled to keep volume (and cost) sane.
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 1.0,
    // Don't capture PII by default — this is a regulated, KYC-heavy product.
    sendDefaultPii: false,
  });
}

// Lets Sentry tie client navigations to traces (Next.js 16 App Router).
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
