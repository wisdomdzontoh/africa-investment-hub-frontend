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
    // Only Google is ever configured/left visible (see HideExcludedProviders
    // for the belt-and-suspenders guard) — full width, no half-width button
    // with dead space beside it.
    socialButtonsBlockButton:
      "h-11 w-full justify-center gap-2.5 border border-[var(--ink-border)] bg-[var(--surface-card)] hover:bg-[var(--ink-hover-tint)] focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2",
    socialButtonsBlockButtonText: "font-sans text-sm font-semibold text-[var(--ink)]",
    dividerRow: "mx-auto w-full",
    dividerLine: "bg-[var(--accent-border)]",
    dividerText:
      "font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]",
    form: "mx-auto w-full",
    formFieldRow: "w-full",
    formFieldLabel:
      "font-sans text-sm font-medium normal-case tracking-normal text-[var(--ink)]",
    formButtonPrimary:
      "h-11 w-full bg-[var(--ink)] hover:bg-[var(--accent)] text-white font-mono text-[13px] font-semibold normal-case shadow-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2",
    formButtonReset:
      "h-11 font-mono text-[13px] font-semibold text-[var(--text-muted)] hover:bg-[var(--bg-section)]",
    footer: "bg-transparent border-0 shadow-none pt-2 pb-0",
    footerAction: "justify-center py-0",
    footerActionText: "text-sm text-[var(--text-muted)]",
    footerActionLink:
      "text-[var(--accent)] hover:text-[var(--accent-bright)] font-semibold",
    footerPages: "hidden",
    formFieldInput:
      "h-11 w-full border border-[var(--ink-border)] focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_var(--accent-tint-08)] rounded-[var(--radius-md)] text-[15px]",
    formFieldErrorText: "text-sm text-[var(--destructive)]",
    formFieldInputShowPasswordButton: "text-[var(--text-muted)] hover:text-[var(--ink)]",
    identityPreviewEditButton: "text-[var(--accent)]",
    formResendCodeLink: "text-[var(--accent)]",
    otpCodeFieldInput:
      "border border-[var(--ink-border)] focus:border-[var(--accent)] rounded-[var(--radius-md)]",
    alertText: "text-sm",
    // Form-level error block (wrong password, expired code, etc.) — one
    // bordered block in the error token, above the provider button/fields.
    alert:
      "rounded-[var(--radius-md)] border border-[color-mix(in_srgb,var(--destructive)_35%,var(--ink-border))] bg-[color-mix(in_srgb,var(--destructive)_6%,white)]",
    devModeNotice: "hidden",
  },
} as const;
