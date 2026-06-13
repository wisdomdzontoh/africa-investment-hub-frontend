import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { EmptyState } from "./EmptyState";

describe("EmptyState", () => {
  it("renders the title", () => {
    render(<EmptyState title="No projects yet" />);
    expect(screen.getByText("No projects yet")).toBeInTheDocument();
  });

  it("renders an optional description and action", () => {
    render(
      <EmptyState
        title="Nothing here"
        description="Try a different filter"
        action={<button type="button">Clear filters</button>}
      />,
    );
    expect(screen.getByText("Try a different filter")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Clear filters" })).toBeInTheDocument();
  });

  it("omits the description node when none is given", () => {
    render(<EmptyState title="Empty" />);
    expect(screen.queryByText("Try a different filter")).not.toBeInTheDocument();
  });
});
