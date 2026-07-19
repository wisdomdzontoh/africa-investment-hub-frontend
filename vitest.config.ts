import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// Unit + component tests (FE-15). Production-build smoke checks run as plain
// HTTP probes in CI (see .github/workflows/ci.yml `smoke` job) — no browser.
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["**/*.{test,spec}.{ts,tsx}"],
    exclude: ["node_modules/**", ".next/**"],
    css: false,
    // The default `forks` pool can hang spawning child processes on Windows;
    // worker_threads start reliably here.
    pool: "threads",
  },
});
