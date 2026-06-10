"use client";

import { useState } from "react";
import { Tabs } from "@/components/ds";

type DesignSystemShowcaseProps = {
  staticSections: React.ReactNode;
};

export function DesignSystemShowcase({ staticSections }: DesignSystemShowcaseProps) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <>
      <section className="mb-14">
        <h2 className="mb-4 text-lg font-semibold text-[var(--ink)]">Tabs</h2>
        <div className="max-w-lg rounded-[var(--radius-card)] bg-[var(--surface-dark)] p-2">
          <Tabs
            items={["Overview", "Financials", "Documents"]}
            active={activeTab}
            onChange={setActiveTab}
          />
        </div>
      </section>

      {staticSections}
    </>
  );
}
