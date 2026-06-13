"use client";

import { Check, ShieldCheck, Trash2, UploadCloud } from "lucide-react";
import { createContext, useContext, useState } from "react";
import type { StagedDocument } from "@/lib/onboarding/types";
import { cn } from "@/lib/utils";

/* ------------------------- staged-documents store ------------------------ */
// Documents are kept outside react-hook-form because File objects are not
// serializable (drafts) and are uploaded only after the profile is created.

type DocsStore = {
  docs: StagedDocument[];
  setDoc: (docType: string, file: File | null) => void;
  addDoc: (docType: string, file: File) => void;
  removeAt: (index: number) => void;
};

const DocsContext = createContext<DocsStore | null>(null);

export function WizardDocsProvider({ children }: { children: React.ReactNode }) {
  const [docs, setDocs] = useState<StagedDocument[]>([]);
  const store: DocsStore = {
    docs,
    setDoc: (docType, file) =>
      setDocs((prev) => {
        const rest = prev.filter((d) => d.docType !== docType);
        return file ? [...rest, { docType, file }] : rest;
      }),
    addDoc: (docType, file) => setDocs((prev) => [...prev, { docType, file }]),
    removeAt: (index) => setDocs((prev) => prev.filter((_, i) => i !== index)),
  };
  return <DocsContext.Provider value={store}>{children}</DocsContext.Provider>;
}

export function useWizardDocs(): DocsStore {
  const ctx = useContext(DocsContext);
  if (!ctx) throw new Error("useWizardDocs must be used within WizardDocsProvider");
  return ctx;
}

/* ------------------------------ file drop -------------------------------- */

const ACCEPT = ".pdf,.png,.jpg,.jpeg";

type FileDropProps = {
  docType: string;
  label: string;
  required?: boolean;
  hint?: string;
  accept?: string;
  /** Allow multiple files under the same docType. */
  multi?: boolean;
};

export function FileDropField({
  docType,
  label,
  required,
  hint,
  accept = "PDF, PNG, JPG · max 50MB",
  multi,
}: FileDropProps) {
  const { docs, setDoc, addDoc, removeAt } = useWizardDocs();
  const mine = docs.map((d, i) => ({ ...d, i })).filter((d) => d.docType === docType);
  const [drag, setDrag] = useState(false);

  const onFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    if (multi) {
      Array.from(files).forEach((f) => addDoc(docType, f));
    } else {
      setDoc(docType, files[0]);
    }
  };

  const showDrop = multi || mine.length === 0;

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </label>

      {showDrop && (
        <label
          onDragOver={(e) => {
            e.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDrag(false);
            onFiles(e.dataTransfer.files);
          }}
          className={cn(
            "flex cursor-pointer flex-col items-center gap-1.5 rounded-[var(--radius-base)] border border-dashed px-4 py-6 text-center transition-colors",
            drag
              ? "border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_8%,transparent)]"
              : "border-border bg-[var(--surface-sunken)]/40 hover:border-[var(--accent)]/50",
          )}
        >
          <UploadCloud className="size-6 text-muted-foreground" aria-hidden />
          <span className="text-sm text-foreground">
            <span className="font-semibold">Drag &amp; drop</span> or{" "}
            <span className="font-semibold text-[var(--accent)]">browse</span>
          </span>
          <span className="text-xs text-muted-foreground">{accept}</span>
          <input
            type="file"
            accept={ACCEPT}
            multiple={multi}
            className="sr-only"
            onChange={(e) => {
              onFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </label>
      )}

      {mine.map((d) => (
        <div
          key={d.i}
          className="flex items-center gap-2.5 rounded-[var(--radius-base)] border border-border bg-background px-3 py-2"
        >
          <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[color-mix(in_srgb,var(--accent)_15%,transparent)] text-[var(--accent)]">
            <Check className="size-3.5" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">{d.file.name}</p>
            <p className="text-xs text-muted-foreground">Staged · uploads after you submit</p>
          </div>
          <button
            type="button"
            onClick={() => removeAt(d.i)}
            aria-label="Remove"
            className="grid size-8 place-items-center rounded-[var(--radius-base)] text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="size-4" aria-hidden />
          </button>
        </div>
      ))}

      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function DocsPrivacyNote({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2 rounded-[var(--radius-base)] border border-border bg-[var(--surface-sunken)]/40 px-3 py-2.5 text-sm text-muted-foreground">
      <ShieldCheck className="mt-0.5 size-4 shrink-0 text-[var(--accent)]" aria-hidden />
      <span>{text}</span>
    </div>
  );
}
