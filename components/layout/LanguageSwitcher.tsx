"use client";

import { Check, ChevronDown } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { Flag } from "@/components/common/Flag";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const LOCALE_FLAGS: Record<Locale, string> = {
  en: "gb",
  fr: "fr",
  zh: "cn",
};

const LOCALE_CODES: Record<Locale, string> = {
  en: "EN",
  fr: "FR",
  zh: "ZH",
};

export function LanguageSwitcher({
  className,
  variant = "light",
}: {
  className?: string;
  variant?: "light" | "dark";
}) {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("nav");
  const isDark = variant === "dark";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "lang-switcher-trigger",
          isDark && "lang-switcher-trigger-dark",
          className,
        )}
        aria-label={t("language")}
      >
        <Flag code={LOCALE_FLAGS[locale]} className="lang-switcher-flag" />
        <span className="lang-switcher-code">{LOCALE_CODES[locale]}</span>
        <span className="lang-switcher-label hidden min-[420px]:inline">
          {t(`languages.${locale}`)}
        </span>
        <ChevronDown className="lang-switcher-chevron" aria-hidden />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="lang-switcher-menu w-44">
        {routing.locales.map((l) => {
          const active = locale === l;
          return (
            <DropdownMenuItem
              key={l}
              className={cn(
                "lang-switcher-item gap-2.5 py-2",
                active && "bg-muted",
              )}
              onClick={() => router.replace(pathname, { locale: l })}
            >
              <Flag code={LOCALE_FLAGS[l]} className="shrink-0" />
              <span className="flex-1 font-semibold">{t(`languages.${l}`)}</span>
              <span className="text-[var(--text-2xs)] font-bold text-[var(--text-muted)]">
                {LOCALE_CODES[l]}
              </span>
              {active && (
                <Check
                  className="size-4 shrink-0 text-[var(--orange-deep)]"
                  aria-hidden
                />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
