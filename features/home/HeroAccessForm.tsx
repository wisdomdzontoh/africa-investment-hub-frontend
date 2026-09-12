"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ds";

export function HeroAccessForm() {
  const t = useTranslations("home.hero");
  const router = useRouter();
  const [email, setEmail] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO(lead-capture): there's no dedicated registration/lead-capture API
    // yet, so the low-commitment path forwards straight to Clerk sign-up with
    // the email prefilled instead of posting anywhere. Swap this for a real
    // POST once a lead-capture endpoint exists.
    router.push(`/sign-up?email=${encodeURIComponent(email)}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 sm:flex-row sm:items-stretch"
    >
      <label htmlFor="hero-email" className="sr-only">
        {t("emailLabel")}
      </label>
      <input
        id="hero-email"
        name="email"
        type="email"
        inputMode="email"
        required
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={t("emailPlaceholder")}
        className="w-full min-w-0 flex-1 rounded-[var(--radius-md)] border border-[var(--ink-border)] bg-[var(--surface-card)] px-3.5 py-3 font-sans text-sm text-[var(--ink)] outline-none transition-[border-color,box-shadow] duration-150 ease-[ease] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_var(--accent-tint-08)]"
      />
      <Button type="submit" variant="dark" size="lg" className="shrink-0">
        {t("emailSubmit")}
      </Button>
    </form>
  );
}
