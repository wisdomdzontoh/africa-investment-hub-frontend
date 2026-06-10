"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { BrandedButton } from "@/components/brand/Button";
import {
  Field,
  FieldError,
  FieldLabel,
  FieldGroup,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

function createContactSchema(t: (key: string) => string) {
  return z.object({
    name: z.string().min(1, t("errors.nameRequired")),
    email: z.string().email(t("errors.emailInvalid")),
    company: z.string().optional(),
    subject: z.string().min(1, t("errors.subjectRequired")),
    message: z.string().min(20, t("errors.messageMin")),
  });
}

type ContactFormValues = z.infer<ReturnType<typeof createContactSchema>>;

function RequiredMark() {
  return (
    <span className="text-[var(--destructive)]" aria-hidden>
      *
    </span>
  );
}

export function ContactForm() {
  const t = useTranslations("contact.form");
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const schema = createContactSchema(t);

  const form = useForm<ContactFormValues>({
    resolver: standardSchemaResolver(schema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      email: "",
      company: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async () => {
    setSubmitError(false);
    try {
      // Simulated submission — swap for the real contact endpoint.
      await new Promise((resolve, reject) =>
        setTimeout(() => (Math.random() < 0.02 ? reject(new Error()) : resolve(null)), 900),
      );
      setSubmitted(true);
    } catch {
      setSubmitError(true);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-[var(--radius-base)] border border-border bg-card p-8 text-center">
        <span className="mx-auto mb-4 inline-flex size-12 items-center justify-center rounded-full bg-[var(--accent-tint-10)] text-[var(--accent)]">
          <CheckCircle2 className="size-6" aria-hidden />
        </span>
        <h3 className="h3">{t("successTitle")}</h3>
        <p className="lead mt-2 text-[var(--text-sm)]">{t("successBody")}</p>
        <BrandedButton
          variant="outline"
          className="mt-5"
          onClick={() => {
            form.reset();
            setSubmitted(false);
          }}
        >
          {t("sendAnother")}
        </BrandedButton>
      </div>
    );
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      noValidate
      className="rounded-[var(--radius-base)] border border-border bg-card p-6"
    >
      {submitError && (
        <div
          role="alert"
          className="mb-5 flex items-start gap-3 rounded-[var(--radius-base)] border border-[color-mix(in_srgb,var(--destructive)_35%,var(--border))] bg-[color-mix(in_srgb,var(--destructive)_8%,white)] p-3.5"
        >
          <AlertTriangle
            className="mt-0.5 size-4 shrink-0 text-[var(--destructive)]"
            aria-hidden
          />
          <div className="text-[var(--text-sm)]">
            <p className="font-semibold text-[var(--destructive)]">{t("failTitle")}</p>
            <p className="text-[var(--text-muted)]">{t("failBody")}</p>
          </div>
        </div>
      )}

      <FieldGroup className="gap-5">
        <Field>
          <FieldLabel htmlFor="name">
            {t("name")} <RequiredMark />
          </FieldLabel>
          <Input id="name" autoComplete="name" {...form.register("name")} />
          <FieldError errors={[form.formState.errors.name]} />
        </Field>
        <Field>
          <FieldLabel htmlFor="email">
            {t("email")} <RequiredMark />
          </FieldLabel>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            {...form.register("email")}
          />
          <FieldError errors={[form.formState.errors.email]} />
        </Field>
        <Field>
          <FieldLabel htmlFor="company">
            {t("company")}{" "}
            <span className="text-[var(--text-xs)] font-normal text-[var(--text-muted)]">
              ({t("optional")})
            </span>
          </FieldLabel>
          <Input id="company" autoComplete="organization" {...form.register("company")} />
        </Field>
        <Field>
          <FieldLabel htmlFor="subject">
            {t("subject")} <RequiredMark />
          </FieldLabel>
          <Input id="subject" {...form.register("subject")} />
          <FieldError errors={[form.formState.errors.subject]} />
        </Field>
        <Field>
          <FieldLabel htmlFor="message">
            {t("message")} <RequiredMark />
          </FieldLabel>
          <Textarea id="message" rows={5} {...form.register("message")} />
          <FieldError errors={[form.formState.errors.message]} />
        </Field>
        <BrandedButton
          type="submit"
          size="lg"
          loading={form.formState.isSubmitting}
          className="w-full sm:w-auto"
        >
          {form.formState.isSubmitting ? t("submitting") : t("submit")}
        </BrandedButton>
      </FieldGroup>
    </form>
  );
}
