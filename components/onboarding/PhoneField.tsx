"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useController, useFormContext, useWatch } from "react-hook-form";
import { Flag } from "@/components/common/Flag";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  InputGroup,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DIAL_CODES, dialCode } from "@/lib/data/dial-codes";
import { WORLD_COUNTRIES } from "@/lib/data/world-countries";
import { controlH, FieldShell, useFieldError } from "@/components/onboarding/fields";

/** Longest dial prefix in the stored value → { dial, national }. */
function splitPhone(value: string): { dial: string; national: string } {
  const v = value.trim();
  if (!v.startsWith("+")) return { dial: "", national: v };
  let best = "";
  for (const d of Object.values(DIAL_CODES)) {
    if (v.startsWith(d) && d.length > best.length) best = d;
  }
  if (!best) return { dial: "", national: v };
  return { dial: best, national: v.slice(best.length).trim() };
}

type Props = {
  name: string;
  label: string;
  required?: boolean;
  hint?: string;
  placeholder?: string;
  /** Form field holding an ISO country code — prefills the dial code
   *  (e.g. country of registration) until the user picks one explicitly. */
  syncWith?: string;
  searchPlaceholder?: string;
  emptyText?: string;
};

/** International phone input: flag + dial-code picker, national number.
 *  Stores one string in form state: `+<dial> <national>`. */
export function PhoneField({
  name,
  label,
  required,
  hint,
  placeholder,
  syncWith,
  searchPlaceholder,
  emptyText = "No match.",
}: Props) {
  const { control, getValues, setValue } = useFormContext();
  const { field } = useController({ name, control });
  const error = useFieldError(name);
  const watched = useWatch({ control, name: (syncWith ?? name) as never }) as unknown;
  const syncedCountry = typeof watched === "string" ? watched : undefined;
  const [open, setOpen] = useState(false);
  // The user's explicit pick wins over the synced country and prefix guesses
  // (dial codes are shared — +1 alone can't tell us which flag to show).
  const [pickedIso, setPickedIso] = useState<string | null>(null);

  const value: string = field.value ?? "";
  const { dial, national } = useMemo(() => splitPhone(value), [value]);

  const iso = useMemo(() => {
    if (pickedIso && DIAL_CODES[pickedIso] === dial) return pickedIso;
    if (syncWith && syncedCountry && DIAL_CODES[syncedCountry.toLowerCase()] === dial) {
      return syncedCountry.toLowerCase();
    }
    if (!dial) return null;
    return (
      WORLD_COUNTRIES.find((c) => DIAL_CODES[c.code] === dial)?.code ?? null
    );
  }, [pickedIso, syncWith, syncedCountry, dial]);

  // Prefill the dial code from the synced country while the number is empty.
  // getValues/setValue are stable — the effect only re-runs on country change.
  useEffect(() => {
    if (!syncWith || !syncedCountry) return;
    const code = dialCode(syncedCountry);
    if (!code) return;
    const current = splitPhone((getValues(name as never) as unknown as string | undefined) ?? "");
    if (current.national === "") {
      // A stale explicit pick is ignored by the `iso` derivation when its
      // dial no longer matches, so no state reset is needed here.
      setValue(name as never, `${code} ` as never, { shouldDirty: false });
    }
  }, [syncWith, syncedCountry, name, getValues, setValue]);

  const compose = (nextDial: string, nextNational: string) => {
    const cleaned = nextNational.replace(/[^\d ()-]/g, "");
    field.onChange(nextDial ? `${nextDial} ${cleaned}` : cleaned);
  };

  return (
    <FieldShell label={label} htmlFor={name} required={required} hint={hint} error={error}>
      <InputGroup className={controlH}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <InputGroupButton
              size="sm"
              aria-expanded={open}
              aria-label={label}
              className="ml-1 gap-1.5 px-2 font-mono text-[13px] text-foreground"
            >
              {iso ? (
                <Flag code={iso} />
              ) : (
                <span aria-hidden className="inline-block w-5 text-center">🌐</span>
              )}
              {dial || "+…"}
              <ChevronDown className="size-3.5 text-muted-foreground" aria-hidden />
            </InputGroupButton>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-72 p-0">
            <Command>
              <CommandInput placeholder={searchPlaceholder ?? "Search…"} />
              <CommandList>
                <CommandEmpty>{emptyText}</CommandEmpty>
                <CommandGroup>
                  {WORLD_COUNTRIES.filter((c) => DIAL_CODES[c.code]).map((c) => (
                    <CommandItem
                      key={c.code}
                      value={`${c.name} ${DIAL_CODES[c.code]}`}
                      onSelect={() => {
                        setPickedIso(c.code);
                        compose(DIAL_CODES[c.code], national);
                        setOpen(false);
                      }}
                    >
                      <Flag code={c.code} />
                      <span className="flex-1 truncate">{c.name}</span>
                      <span className="font-mono text-xs text-muted-foreground">
                        {DIAL_CODES[c.code]}
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <InputGroupInput
          id={name}
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          value={national}
          placeholder={placeholder}
          aria-invalid={!!error}
          className="font-mono"
          name={field.name}
          onBlur={field.onBlur}
          onChange={(e) => compose(dial, e.target.value)}
        />
      </InputGroup>
    </FieldShell>
  );
}
