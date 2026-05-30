import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <div className="bg-[var(--surface-muted)]">{children}</div>;
}
