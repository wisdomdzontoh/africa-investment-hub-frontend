import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

async function loadMessages(locale: string) {
  const en = (await import("../messages/en.json")).default;
  if (locale === "en") return en;

  try {
    const localeMessages = (await import(`../messages/${locale}.json`)).default;
    return deepMerge(en, localeMessages);
  } catch {
    return en;
  }
}

function deepMerge<T extends Record<string, unknown>>(
  base: T,
  override: Record<string, unknown>,
): T {
  const result = { ...base } as Record<string, unknown>;
  for (const key of Object.keys(override)) {
    const baseVal = base[key];
    const overrideVal = override[key];
    if (
      baseVal &&
      overrideVal &&
      typeof baseVal === "object" &&
      typeof overrideVal === "object" &&
      !Array.isArray(baseVal) &&
      !Array.isArray(overrideVal)
    ) {
      result[key] = deepMerge(
        baseVal as Record<string, unknown>,
        overrideVal as Record<string, unknown>,
      );
    } else if (overrideVal !== undefined && overrideVal !== "") {
      result[key] = overrideVal;
    }
  }
  return result as T;
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: await loadMessages(locale),
  };
});
