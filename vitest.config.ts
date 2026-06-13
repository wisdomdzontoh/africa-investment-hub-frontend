import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// Unit + component tests (FE-15). Playwright e2e lives in `e2e/` and is run
// separately via `pnpm e2e` — excluded here so Vitest never tries to run it.
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["**/*.{test,spec}.{ts,tsx}"],
    exclude: ["node_modules/**", ".next/**", "e2e/**"],
    css: false,
    // The default `forks` pool can hang spawning child processes on Windows;
    // worker_threads start reliably here.
    pool: "threads",
  },
});
