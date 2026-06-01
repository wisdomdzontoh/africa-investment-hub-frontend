export const clerkAppearance = {
  variables: {
    // Brand red (matches --primary / --brand-primary in globals.css).
    colorPrimary: "#c0392b",
    colorText: "#211915",
    borderRadius: "0.5rem",
    fontFamily: "var(--font-sans)",
  },
  elements: {
    card: "shadow-lg border border-border",
    headerTitle: "font-display",
    formButtonPrimary:
      "bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white",
  },
} as const;
