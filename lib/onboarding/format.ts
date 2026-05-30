// Helpers for the onboarding wizards: money parsing/formatting and number
// coercion. The backend stores these as Decimal/int, so the wire payload must
// be plain numbers (or omitted), never the formatted display strings.

/** Parse a user-entered money/number string ("$2,000,000", "12%") to a number.
 *  Returns undefined for empty/invalid input so optional fields can be omitted. */
export function parseNumeric(value: unknown): number | undefined {
  if (value === null || value === undefined) return undefined;
  if (typeof value === "number") return Number.isFinite(value) ? value : undefined;
  const cleaned = String(value).replace(/[^0-9.\-]/g, "");
  if (cleaned === "" || cleaned === "-" || cleaned === ".") return undefined;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : undefined;
}

/** Format a numeric string as grouped USD while typing (no decimals). */
export function formatMoneyInput(value: string): string {
  const n = parseNumeric(value);
  if (n === undefined) return "";
  return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

/** Display a stored number as compact USD, e.g. $2,000,000. */
export function displayMoney(value: number | string | undefined | null): string {
  const n = parseNumeric(value);
  if (n === undefined) return "—";
  return `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}
