import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="auth-route min-h-screen bg-[color-mix(in_srgb,var(--accent)_26%,var(--surface-dark))]">
      {children}
    </div>
  );
}
