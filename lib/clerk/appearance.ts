// Clerk widget styling aligned to the DS. AuthShell owns the white card on dark;
// Clerk renders flush inside it — no nested card, border, or shadow.
export const clerkAppearance = {
  options: {
    elevation: "flush",
    unsafe_disableDevelopmentModeWarnings: true,
  },
  variables: {
    colorPrimary: "#C0392B",
    colorText: "#1A1A1A",
    colorTextSecondary: "#8A8A8A",
    colorBackground: "transparent",
    colorInputBackground: "#FFFFFF",
    borderRadius: "0.5rem",
    fontFamily: "var(--font-sans)",
  },
  elements: {
    rootBox: "mx-auto w-full max-w-full",
    cardBox: "mx-auto w-full max-w-full shadow-none bg-transparent",
    card: "mx-auto w-full max-w-full gap-4 rounded-none border-0 bg-transparent p-0 shadow-none",
    main: "mx-auto w-full max-w-full",
    logoBox: "hidden",
    logoImage: "hidden",
    header: "hidden",
    headerTitle: "hidden",
    headerSubtitle: "hidden",
    socialButtons: "mx-auto w-full",
    socialButtonsBlockButton:
      "h-11 w-full justify-center border border-[var(--ink-border)] bg-[var(--surface-card)] hover:bg-[var(--ink-hover-tint)]",
    dividerRow: "mx-auto w-full",
    dividerLine: "bg-[var(--accent-border)]",
    dividerText: "text-[var(--text-muted)]",
    form: "mx-auto w-full",
    formFieldRow: "w-full",
    formFieldLabel:
      "font-sans text-sm font-medium normal-case tracking-normal text-[var(--ink)]",
    formButtonPrimary:
      "h-11 w-full bg-[var(--accent)] hover:bg-[var(--accent-bright)] text-white font-mono text-[13px] font-semibold normal-case shadow-none",
    formButtonReset:
      "h-11 font-mono text-[13px] font-semibold text-[var(--text-muted)] hover:bg-[var(--bg-section)]",
    footer: "bg-transparent border-0 shadow-none pt-2 pb-0",
    footerAction: "justify-center py-0",
    footerActionText: "text-sm text-[var(--text-muted)]",
    footerActionLink:
      "text-[var(--accent)] hover:text-[var(--accent-bright)] font-semibold",
    footerPages: "hidden",
    formFieldInput:
      "h-11 w-full border border-[var(--ink-border)] focus:border-[var(--accent)] rounded-[var(--radius-md)] text-[15px]",
    identityPreviewEditButton: "text-[var(--accent)]",
    formResendCodeLink: "text-[var(--accent)]",
    otpCodeFieldInput:
      "border border-[var(--ink-border)] focus:border-[var(--accent)] rounded-[var(--radius-md)]",
    alertText: "text-sm",
    devModeNotice: "hidden",
  },
} as const;
