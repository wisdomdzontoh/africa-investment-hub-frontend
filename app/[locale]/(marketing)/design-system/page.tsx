import { notFound } from "next/navigation";
import {
  Badge,
  Button,
  Card,
  Checkbox,
  ChecklistRow,
  Chip,
  Input,
  ProgressBar,
  ProjectCard,
  SectionLabel,
  Select,
  StatBlock,
  Tabs,
} from "@/components/ds";
import { DesignSystemShowcase } from "./showcase";

export default function DesignSystemPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return (
    <div className="page py-16">
      <header className="mb-12">
        <SectionLabel dot>Phase 0</SectionLabel>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-[var(--ink)]">
          Design System
        </h1>
        <p className="mt-2 max-w-2xl text-[var(--text-body)]">
          Dev-only showcase of ported DS v3 components. Not linked in production
          navigation.
        </p>
      </header>

      <DesignSystemShowcase
        staticSections={
          <>
            <section className="mb-14">
              <h2 className="mb-4 text-lg font-semibold text-[var(--ink)]">
                Buttons
              </h2>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary">Primary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="dark">Dark</Button>
                <Button variant="accentOutline">Accent outline</Button>
              </div>
              <div className="mt-4 rounded-[var(--radius-card)] bg-[var(--surface-dark)] p-6">
                <Button variant="onDark">On dark</Button>
              </div>
            </section>

            <section className="mb-14">
              <h2 className="mb-4 text-lg font-semibold text-[var(--ink)]">
                Badges &amp; chips
              </h2>
              <div className="flex flex-wrap items-center gap-3">
                <Badge tone="accent">Accent</Badge>
                <Badge tone="neutral">Neutral</Badge>
                <Badge tone="ink">Ink</Badge>
                <Badge tone="solid">Solid</Badge>
                <Badge risk="low" />
                <Badge risk="medium" />
                <Badge risk="high" />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Chip>Default</Chip>
                <Chip active>Active</Chip>
              </div>
            </section>

            <section className="mb-14">
              <h2 className="mb-4 text-lg font-semibold text-[var(--ink)]">
                Cards
              </h2>
              <div className="grid gap-4 md:grid-cols-3">
                <Card variant="light">
                  <p className="text-sm text-[var(--text-body)]">Light card</p>
                </Card>
                <Card variant="tinted">
                  <p className="text-sm text-[var(--text-body)]">Tinted card</p>
                </Card>
                <Card variant="dark">
                  <p className="text-sm text-[var(--on-dark-85)]">Dark card</p>
                </Card>
              </div>
            </section>

            <section className="mb-14">
              <h2 className="mb-4 text-lg font-semibold text-[var(--ink)]">
                Forms
              </h2>
              <div className="grid max-w-md gap-4">
                <Input label="Email" placeholder="you@example.com" hint="We never share your email." />
                <Select
                  label="Country"
                  placeholder="Select a country"
                  options={["Kenya", "Nigeria", "South Africa"]}
                />
                <Checkbox label="Subscribe to updates" />
              </div>
            </section>

            <section className="mb-14">
              <h2 className="mb-4 text-lg font-semibold text-[var(--ink)]">
                Data
              </h2>
              <div className="grid gap-6 lg:grid-cols-2">
                <Card variant="dark" padding="40px">
                  <StatBlock
                    value="54"
                    label="Countries"
                    caption="Across the continent"
                  />
                </Card>
                <div className="space-y-4">
                  <ProgressBar value={72} label="Due diligence" status="72%" />
                  <Card padding="24px">
                    <ChecklistRow label="KYC verified" state="done" />
                    <ChecklistRow label="Legal review" state="pending" />
                    <ChecklistRow label="Board approval" state="approved" divider={false} />
                  </Card>
                </div>
              </div>
            </section>

            <section className="mb-14">
              <h2 className="mb-4 text-lg font-semibold text-[var(--ink)]">
                Project card
              </h2>
              <div className="max-w-md">
                <ProjectCard
                  title="Solar mini-grid expansion"
                  sector="Energy"
                  country="Kenya"
                  funding="$2.4M"
                  roi="18%"
                  timeline="36 mo"
                  risk="low"
                  summary="Distributed solar for rural communities with government-backed offtake."
                />
              </div>
            </section>
          </>
        }
      />
    </div>
  );
}
