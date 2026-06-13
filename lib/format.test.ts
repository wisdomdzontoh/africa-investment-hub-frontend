import { describe, expect, it } from "vitest";
import { flagUrl, fmtMoney, fmtNumber, fmtRoi } from "./format";

describe("fmtMoney", () => {
  it("formats millions, trimming a trailing .0", () => {
    expect(fmtMoney(5_000_000)).toBe("$5M");
    expect(fmtMoney(2_500_000)).toBe("$2.5M");
  });

  it("formats thousands", () => {
    expect(fmtMoney(5_000)).toBe("$5K");
    expect(fmtMoney(12_000)).toBe("$12K");
  });

  it("leaves sub-thousand values raw", () => {
    expect(fmtMoney(500)).toBe("$500");
  });
});

describe("fmtRoi", () => {
  it("renders an en-dash range with a percent suffix", () => {
    expect(fmtRoi(8, 14)).toBe("8–14%");
  });
});

describe("fmtNumber", () => {
  it("delegates to locale grouping", () => {
    expect(fmtNumber(1234567)).toBe((1234567).toLocaleString());
  });
});

describe("flagUrl", () => {
  it("builds a flagcdn svg url", () => {
    expect(flagUrl("ke")).toBe("https://flagcdn.com/ke.svg");
  });
});
