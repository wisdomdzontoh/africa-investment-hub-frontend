import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const isDev = process.env.NODE_ENV === "development";
const apiOrigin = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

// Content-Security-Policy (SEC-01). Allows Clerk (auth), the backend API,
// flagcdn (country flags), and Cloudflare Turnstile (Clerk bot protection).
// `unsafe-inline` is required by Next.js inline runtime scripts; `unsafe-eval`
// only in dev (react-refresh).
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://*.clerk.accounts.dev https://challenges.cloudflare.com`,
  "style-src 'self' 'unsafe-inline'",
  `connect-src 'self' ${apiOrigin} https://*.clerk.accounts.dev https://clerk-telemetry.com https://*.sentry.io ws: wss:`,
  "img-src 'self' data: blob: https://img.clerk.com https://flagcdn.com",
  "font-src 'self' data:",
  "frame-src https://challenges.cloudflare.com https://*.clerk.accounts.dev",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  // 2 years; only meaningful behind HTTPS (prod).
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
];

const nextConfig: NextConfig = {
  // Self-contained server bundle for the container deployment (INFRA-05).
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "flagcdn.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "img.clerk.com",
        pathname: "/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

// Source-map upload only runs when Sentry credentials are present (prod CD),
// so local and CI builds stay clean and offline-friendly (FE-16).
const sentryEnabled = Boolean(
  process.env.SENTRY_AUTH_TOKEN && process.env.SENTRY_ORG && process.env.SENTRY_PROJECT,
);

export default withSentryConfig(withNextIntl(nextConfig), {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  silent: !process.env.CI,
  // Skip source-map upload entirely without credentials.
  sourcemaps: { disable: !sentryEnabled },
  // Route Sentry's browser requests through a same-origin path to dodge ad
  // blockers (tunneling). Safe no-op when Sentry is disabled.
  tunnelRoute: "/monitoring",
  disableLogger: true,
  telemetry: false,
});
