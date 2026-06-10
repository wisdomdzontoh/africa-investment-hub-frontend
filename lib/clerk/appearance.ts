// Clerk widget styling aligned to the DS: terracotta accent, Inter, ink text,
// flat white card with an accent hairline. The branded frame is provided by
// AuthShell, so the widget itself stays clean and borderless-leaning.
export const clerkAppearance = {
  variables: {
    colorPrimary: "#C0392B",
    colorText: "#1A1A1A",
    colorTextSecondary: "#8A8A8A",
    colorBackground: "#FFFFFF",
    colorInputBackground: "#FFFFFF",
    borderRadius: "0.5rem",
    fontFamily: "var(--font-sans)",
  },
  elements: {
    rootBox: "w-full",
    cardBox: "w-full shadow-none",
    card: "w-full rounded-[var(--radius-card)] border border-[var(--accent-border)] bg-[var(--surface-card)] shadow-[var(--shadow-card-hover)]",
    headerTitle: "font-sans tracking-[-0.01em] text-[var(--ink)]",
    headerSubtitle: "text-[var(--text-muted)]",
    socialButtonsBlockButton:
      "border-[1.5px] border-[var(--ink-border)] hover:bg-[var(--ink-hover-tint)]",
    dividerLine: "bg-[var(--accent-border)]",
    formFieldLabel: "font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--text-muted)]",
    formButtonPrimary:
      "bg-[var(--accent)] hover:bg-[var(--accent-bright)] text-white font-mono font-semibold normal-case shadow-none",
    footerActionLink: "text-[var(--accent)] hover:text-[var(--accent-bright)] font-semibold",
    formFieldInput:
      "border border-[var(--ink-border)] focus:border-[var(--accent)] rounded-[var(--radius-md)]",
  },
} as const;
