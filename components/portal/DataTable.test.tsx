import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DataTable, type Column } from "./DataTable";

type Row = { id: string; name: string };

const columns: Column<Row>[] = [
  { key: "name", header: "Name", render: (r) => r.name },
];

describe("DataTable", () => {
  it("renders column headers and row content", () => {
    render(
      <DataTable
        columns={columns}
        rows={[{ id: "1", name: "Acme Capital" }]}
        rowKey={(r) => r.id}
      />,
    );
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Acme Capital")).toBeInTheDocument();
  });

  it("shows the empty slot when there are no rows", () => {
    render(
      <DataTable
        columns={columns}
        rows={[]}
        rowKey={(r) => r.id}
        empty={<span>No records</span>}
      />,
    );
    expect(screen.getByText("No records")).toBeInTheDocument();
  });

  it("renders skeleton cells (no row data) while loading", () => {
    render(
      <DataTable
        columns={columns}
        rows={[{ id: "1", name: "Acme Capital" }]}
        rowKey={(r) => r.id}
        isLoading
      />,
    );
    expect(screen.queryByText("Acme Capital")).not.toBeInTheDocument();
  });

  it("fires onRowClick with the clicked row", async () => {
    const onRowClick = vi.fn();
    render(
      <DataTable
        columns={columns}
        rows={[{ id: "1", name: "Acme Capital" }]}
        rowKey={(r) => r.id}
        onRowClick={onRowClick}
      />,
    );
    await userEvent.click(screen.getByText("Acme Capital"));
    expect(onRowClick).toHaveBeenCalledWith({ id: "1", name: "Acme Capital" });
  });
});
