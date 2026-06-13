import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatusPill } from "./StatusPill";

describe("StatusPill", () => {
  it("renders the status with underscores turned into spaces", () => {
    render(<StatusPill status="in_review" />);
    expect(screen.getByText("in review")).toBeInTheDocument();
  });

  it("prefers an explicit label over the raw status", () => {
    render(<StatusPill status="approved" label="Approved" />);
    expect(screen.getByText("Approved")).toBeInTheDocument();
  });

  it("applies the approved tone tokens", () => {
    const { container } = render(<StatusPill status="approved" />);
    expect(container.firstChild).toHaveClass("bg-[var(--p-success-bg)]");
  });

  it("falls back to neutral tokens for an unknown status", () => {
    const { container } = render(<StatusPill status="mystery" />);
    expect(container.firstChild).toHaveClass("bg-[var(--bg-section)]");
  });
});
