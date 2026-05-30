import type { ReactNode } from "react";
import type { DefaultValues, FieldValues, Path } from "react-hook-form";
import type { ZodType } from "zod";

/** A file staged in a document step, uploaded after the profile is created. */
export type StagedDocument = { docType: string; file: File };

export type ReviewRow = { label: string; value: string; missing?: boolean };

export type WizardStep<T extends FieldValues> = {
  id: string;
  /** Short badge shown in the section header, e.g. "A" or "1". */
  badge: string;
  /** Short label for the step bar. */
  label: string;
  /** Card header title + helper copy. */
  title: string;
  subtitle: string;
  /** Field paths validated when the user tries to leave this step. */
  fields: Path<T>[];
  /** Renders the step body. Reads form state via useFormContext. */
  render: () => ReactNode;
  /** Optional condensed summary for the review screen. */
  summary?: (values: T) => ReviewRow[];
};

export type WizardConfig<T extends FieldValues> = {
  role: string;
  schema: ZodType<T>;
  defaultValues: DefaultValues<T>;
  steps: WizardStep<T>[];
  /** Copy for the review + submit screen. */
  reviewTitle: string;
  reviewSubtitle: string;
  consentLabel: string;
  submitLabel: string;
  submittingLabel: string;
  editLabel: string;
  /** Locale-relative path to send the user after a successful submit
   *  (their role dashboard, where the under-review state is shown). */
  doneRedirect: string;
  /** Final submit. Should throw on failure so the wizard can surface it.
   *  Receives staged documents to upload after the profile is created. */
  onSubmit: (values: T, documents: StagedDocument[]) => Promise<void>;
};
