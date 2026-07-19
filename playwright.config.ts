import { defineConfig, devices } from "@playwright/test";

// E2E smoke tests (FE-15). Run with `pnpm e2e` after `pnpm exec playwright
// install`. CI builds + starts the app; locally it reuses `pnpm dev` if it's
// already running.
const PORT = 3000;
// Loopback IP, not "localhost": CI Chromium has failed to DNS-resolve the
// name (net::ERR_NAME_NOT_RESOLVED) while the server itself was healthy. An
// IP literal needs no resolver. The server binds 0.0.0.0, so this works
// locally and in CI alike.
const baseURL = `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
  webServer: {
    // `next start` refuses `output: "standalone"` builds (Next 16) — CI runs
    // the standalone server directly. Its static assets are copied in by the
    // CI workflow after `pnpm build`. Locally we reuse the dev server.
    command: process.env.CI ? "node .next/standalone/server.js" : "pnpm dev",
    url: baseURL,
    timeout: 120_000,
    reuseExistingServer: !process.env.CI,
  },
});
