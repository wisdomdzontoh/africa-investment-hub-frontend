"use client";

import { Plus, Trash2 } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";

type Option = { value: string; label: string };

type Props = {
  name: string;
  addLabel: string;
  emptyHint?: string;
  max?: number;
  labels: {
    projectName: string;
    country: string;
    sector: string;
    year: string;
  };
  countryOptions: Option[];
  sectorOptions: Option[];
};

const cellBase =
  "w-full rounded-[var(--radius-base)] border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)]";

/** Repeatable rows for the investor track-record step (≤ max entries). */
export function RepeatableProjects({
  name,
  addLabel,
  emptyHint,
  max = 5,
  labels,
  countryOptions,
  sectorOptions,
}: Props) {
  const { control, register } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name });

  return (
    <div className="flex flex-col gap-3">
      {fields.length === 0 && emptyHint && (
        <p className="text-sm text-muted-foreground">{emptyHint}</p>
      )}
      {fields.map((row, i) => (
        <div
          key={row.id}
          className="grid grid-cols-1 gap-2 rounded-[var(--radius-base)] border border-border bg-[var(--surface-sunken)]/40 p-2.5 sm:grid-cols-[1fr_1fr_1fr_88px_auto]"
        >
          <input
            className={cellBase}
            placeholder={labels.projectName}
            {...register(`${name}.${i}.project_name` as const)}
          />
          <select className={cellBase} defaultValue="" {...register(`${name}.${i}.country` as const)}>
            <option value="">{labels.country}</option>
            {countryOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <select className={cellBase} defaultValue="" {...register(`${name}.${i}.sector` as const)}>
            <option value="">{labels.sector}</option>
            {sectorOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <input
            className={cn(cellBase, "font-mono")}
            type="number"
            inputMode="numeric"
            placeholder={labels.year}
            {...register(`${name}.${i}.year` as const, {
              setValueAs: (v) => (v === "" || v === null ? undefined : Number(v)),
            })}
          />
          <button
            type="button"
            onClick={() => remove(i)}
            aria-label="Remove"
            className="grid size-9 place-items-center justify-self-end rounded-[var(--radius-base)] border border-border text-muted-foreground transition-colors hover:border-destructive hover:text-destructive"
          >
            <Trash2 className="size-4" aria-hidden />
          </button>
        </div>
      ))}
      {fields.length < max && (
        <button
          type="button"
          onClick={() => append({ project_name: "", country: "", sector: "", year: undefined })}
          className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-[var(--accent)] hover:underline"
        >
          <Plus className="size-4" aria-hidden /> {addLabel}
        </button>
      )}
    </div>
  );
}
