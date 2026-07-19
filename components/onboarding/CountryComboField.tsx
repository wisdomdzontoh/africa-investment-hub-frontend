"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import { useMemo, useState } from "react";
import { useController, useFormContext } from "react-hook-form";
import { Flag } from "@/components/common/Flag";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { controlH, FieldShell } from "@/components/onboarding/fields";

type Option = { value: string; label: string };

type Props = {
  name: string;
  label: string;
  required?: boolean;
  hint?: string;
  placeholder?: string;
  options: Option[];
  /** Option values are ISO alpha-2 codes → show the country flag. */
  flags?: boolean;
  emptyText?: string;
};

/** Searchable single-select country combobox (shadcn Popover + Command). */
export function CountryComboField({
  name,
  label,
  required,
  hint,
  placeholder,
  options,
  flags = true,
  emptyText = "No country found.",
}: Props) {
  const { control } = useFormContext();
  const { field, fieldState } = useController({ name, control });
  const [open, setOpen] = useState(false);

  const selected = useMemo(
    () => options.find((o) => o.value === field.value),
    [options, field.value],
  );
  const error = fieldState.error?.message as string | undefined;

  return (
    <FieldShell label={label} htmlFor={name} required={required} hint={hint} error={error}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={name}
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-invalid={!!error}
            onBlur={field.onBlur}
            className={cn(
              controlH,
              "w-full justify-between border-input bg-transparent px-3 font-normal shadow-none hover:bg-transparent",
              !selected && "text-muted-foreground",
            )}
          >
            <span className="flex min-w-0 items-center gap-2">
              {selected && flags ? <Flag code={selected.value} /> : null}
              <span className="truncate">{selected?.label ?? placeholder ?? "Select"}</span>
            </span>
            <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" aria-hidden />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-[var(--radix-popover-trigger-width)] p-0">
          <Command>
            <CommandInput placeholder={placeholder ?? "Search…"} />
            <CommandList>
              <CommandEmpty>{emptyText}</CommandEmpty>
              <CommandGroup>
                {options.map((o) => (
                  <CommandItem
                    key={o.value}
                    value={o.label}
                    onSelect={() => {
                      field.onChange(o.value === field.value ? "" : o.value);
                      setOpen(false);
                    }}
                  >
                    {flags ? <Flag code={o.value} /> : null}
                    <span className="flex-1 truncate">{o.label}</span>
                    <Check
                      className={cn(
                        "size-4",
                        o.value === field.value ? "opacity-100" : "opacity-0",
                      )}
                      aria-hidden
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </FieldShell>
  );
}
