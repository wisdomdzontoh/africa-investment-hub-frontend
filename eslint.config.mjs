import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import jsxA11y from "eslint-plugin-jsx-a11y";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Accessibility lint across the app (WCAG 2.1 AA — PRD §7, UI-03). The
  // jsx-a11y plugin is already registered by eslint-config-next, so we enable
  // its recommended ruleset rather than re-declaring the plugin.
  { rules: jsxA11y.flatConfigs.recommended.rules },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Vendored Sentry tunnel/instrumentation output, Playwright artifacts.
    "test-results/**",
  ]),
  // Vendored shadcn/ui primitives: keep them lint-clean for real issues, but
  // don't block CI on the strict newer hook rules they predate. They track
  // upstream shadcn, not our conventions.
  {
    files: ["components/ui/**/*.{ts,tsx}"],
    rules: {
      "react-hooks/set-state-in-effect": "off",
      // Vendored shadcn primitives track upstream; their a11y quirks are
      // handled by consumers, not patched here.
      "jsx-a11y/click-events-have-key-events": "off",
      "jsx-a11y/no-noninteractive-element-interactions": "off",
      "jsx-a11y/anchor-has-content": "off",
    },
  },
]);

export default eslintConfig;
