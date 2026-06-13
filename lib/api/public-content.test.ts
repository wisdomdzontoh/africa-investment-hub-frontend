import { describe, expect, it } from "vitest";
import { resolveLocaleText } from "./public-content";

describe("resolveLocaleText", () => {
  const value = { en: "Climate", fr: "Climat", zh: "气候" };

  it("returns the requested locale", () => {
    expect(resolveLocaleText(value, "fr")).toBe("Climat");
    expect(resolveLocaleText(value, "zh")).toBe("气候");
  });

  it("falls back to English when the locale is missing", () => {
    expect(resolveLocaleText({ en: "Only EN" }, "fr")).toBe("Only EN");
  });

  it("falls back to the first available value when English is absent", () => {
    expect(resolveLocaleText({ fr: "Seulement FR" }, "zh")).toBe("Seulement FR");
  });

  it("returns an empty string for null/empty input", () => {
    expect(resolveLocaleText(null, "en")).toBe("");
    expect(resolveLocaleText({}, "en")).toBe("");
  });
});
