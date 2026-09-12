import type { Metadata } from "next";
import type { ReactNode } from "react";

// Auth screens must never be indexed.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <div className="auth-route min-h-screen">{children}</div>;
}
