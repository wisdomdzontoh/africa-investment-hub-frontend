"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { BrandedButton } from "@/components/brand/Button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
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

export function ContactForm() {
  const t = useTranslations("contact.form");
  const [submitted, setSubmitted] = useState(false);
  const schema = createContactSchema(t);

  const form = useForm<ContactFormValues>({
    resolver: standardSchemaResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async () => {
    await new Promise((r) => setTimeout(r, 900));
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="rounded-[var(--radius-base)] border border-border bg-card p-8 text-center">
        <h3 className="h3">{t("successTitle")}</h3>
        <p className="lead mt-2">{t("successBody")}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="rounded-[var(--radius-base)] border border-border bg-card p-6"
    >
      <FieldGroup className="gap-5">
        <Field>
          <FieldLabel htmlFor="name">{t("name")}</FieldLabel>
          <Input id="name" {...form.register("name")} />
          <FieldError errors={[form.formState.errors.name]} />
        </Field>
        <Field>
          <FieldLabel htmlFor="email">{t("email")}</FieldLabel>
          <Input id="email" type="email" {...form.register("email")} />
          <FieldError errors={[form.formState.errors.email]} />
        </Field>
        <Field>
          <FieldLabel htmlFor="company">{t("company")}</FieldLabel>
          <Input id="company" {...form.register("company")} />
        </Field>
        <Field>
          <FieldLabel htmlFor="subject">{t("subject")}</FieldLabel>
          <Input id="subject" {...form.register("subject")} />
          <FieldError errors={[form.formState.errors.subject]} />
        </Field>
        <Field>
          <FieldLabel htmlFor="message">{t("message")}</FieldLabel>
          <Textarea id="message" rows={5} {...form.register("message")} />
          <FieldError errors={[form.formState.errors.message]} />
        </Field>
        <BrandedButton type="submit" loading={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? t("submitting") : t("submit")}
        </BrandedButton>
      </FieldGroup>
    </form>
  );
}
