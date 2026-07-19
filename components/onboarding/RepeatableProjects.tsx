"use client";

import { Plus, Trash2 } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";

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
          <Input
            className="h-9"
            placeholder={labels.projectName}
            aria-label={labels.projectName}
            {...register(`${name}.${i}.project_name` as const)}
          />
          <NativeSelect
            className="h-9 w-full"
            defaultValue=""
            aria-label={labels.country}
            {...register(`${name}.${i}.country` as const)}
          >
            <NativeSelectOption value="">{labels.country}</NativeSelectOption>
            {countryOptions.map((o) => (
              <NativeSelectOption key={o.value} value={o.value}>
                {o.label}
              </NativeSelectOption>
            ))}
          </NativeSelect>
          <NativeSelect
            className="h-9 w-full"
            defaultValue=""
            aria-label={labels.sector}
            {...register(`${name}.${i}.sector` as const)}
          >
            <NativeSelectOption value="">{labels.sector}</NativeSelectOption>
            {sectorOptions.map((o) => (
              <NativeSelectOption key={o.value} value={o.value}>
                {o.label}
              </NativeSelectOption>
            ))}
          </NativeSelect>
          <Input
            className="h-9 font-mono"
            type="number"
            inputMode="numeric"
            placeholder={labels.year}
            aria-label={labels.year}
            {...register(`${name}.${i}.year` as const, {
              setValueAs: (v) => (v === "" || v === null ? undefined : Number(v)),
            })}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => remove(i)}
            aria-label="Remove"
            className="size-9 justify-self-end text-muted-foreground hover:border-destructive hover:text-destructive"
          >
            <Trash2 className="size-4" aria-hidden />
          </Button>
        </div>
      ))}
      {fields.length < max && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => append({ project_name: "", country: "", sector: "", year: undefined })}
          className="w-fit gap-1.5 px-2 text-[var(--accent)] hover:text-[var(--accent)]"
        >
          <Plus className="size-4" aria-hidden /> {addLabel}
        </Button>
      )}
    </div>
  );
}
