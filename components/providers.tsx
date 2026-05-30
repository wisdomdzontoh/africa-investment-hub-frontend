"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <ClerkProvider
      signInUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL}
      signUpUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL}
      signInFallbackRedirectUrl={process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL}
      signUpFallbackRedirectUrl={process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL}
    >
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster position="top-right" richColors />
      </QueryClientProvider>
    </ClerkProvider>
  );
}
