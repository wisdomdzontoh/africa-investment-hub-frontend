import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Vendored Sentry tunnel/instrumentation output, Playwright artifacts.
    "playwright-report/**",
    "test-results/**",
  ]),
  // Vendored shadcn/ui primitives: keep them lint-clean for real issues, but
  // don't block CI on the strict newer hook rules they predate. They track
  // upstream shadcn, not our conventions.
  {
    files: ["components/ui/**/*.{ts,tsx}"],
    rules: {
      "react-hooks/set-state-in-effect": "off",
    },
  },
]);

export default eslintConfig;
