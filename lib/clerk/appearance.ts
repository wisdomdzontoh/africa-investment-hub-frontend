export const clerkAppearance = {
  variables: {
    // Warm brand orange (matches --brand-primary in globals.css), not the old green.
    colorPrimary: "#c2410c",
    colorText: "#1c1917",
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
