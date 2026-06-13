"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useUser } from "@clerk/nextjs";
import { ArrowLeft, Check, Loader2, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import {
  FormProvider,
  useForm,
  type FieldValues,
  type UseFormReturn,
} from "react-hook-form";
import { toast } from "sonner";
import { BrandedButton } from "@/components/brand/Button";
import { Logo } from "@/components/brand/Logo";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { ReviewStep } from "@/components/onboarding/ReviewStep";
import { StepBar } from "@/components/onboarding/StepBar";
import { SubmittedStep } from "@/components/onboarding/SubmittedStep";
import { WizardDocsProvider, useWizardDocs } from "@/components/onboarding/documents";
import { Link, useRouter } from "@/i18n/navigation";
import { clearDraft, loadDraft, saveDraft } from "@/lib/onboarding/draft";
import type { WizardConfig } from "@/lib/onboarding/types";

type Phase = "intake" | "review" | "submitted";

export function Wizard<T extends FieldValues>({ config }: { config: WizardConfig<T> }) {
  const methods = useForm<T>({
    resolver: zodResolver(config.schema as never),
    defaultValues: config.defaultValues,
    mode: "onTouched",
  });

  return (
    <FormProvider {...methods}>
      <WizardDocsProvider>
        <WizardInner config={config} methods={methods} />
      </WizardDocsProvider>
    </FormProvider>
  );
}

function WizardInner<T extends FieldValues>({
  config,
  methods,
}: {
  config: WizardConfig<T>;
  methods: UseFormReturn<T>;
}) {
  const t = useTranslations("onboarding.wizard");
  const router = useRouter();
  const { user } = useUser();
  const { docs } = useWizardDocs();

  const [phase, setPhase] = useState<Phase>("intake");
  const [sec, setSec] = useState(0);
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [saved, setSaved] = useState<"idle" | "saving" | "saved">("idle");

  const steps = config.steps;
  const step = steps[sec];

  // Restore any saved draft once the user id is known.
  const restored = useRef(false);
  useEffect(() => {
    if (restored.current) return;
    restored.current = true;
    const draft = loadDraft<T>(config.role, user?.id);
    if (draft) {
      methods.reset({ ...config.defaultValues, ...draft } as T);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // Debounced autosave of form values to localStorage.
  useEffect(() => {
    const sub = methods.watch((values) => {
      setSaved("saving");
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        saveDraft<T>(config.role, user?.id, values as T);
        setSaved("saved");
      }, 600);
    });
    return () => sub.unsubscribe();
  }, [methods, user?.id, config.role]);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scrollTop = () =>
    document.getElementById("wizard-scroll")?.scrollTo({ top: 0, behavior: "smooth" });

  const next = async () => {
    const ok = await methods.trigger(step.fields as never);
    if (!ok) return;
    if (sec < steps.length - 1) {
      setSec(sec + 1);
    } else {
      setPhase("review");
    }
    scrollTop();
  };

  const back = () => {
    if (phase === "review") {
      setPhase("intake");
      setSec(steps.length - 1);
    } else if (sec > 0) {
      setSec(sec - 1);
    }
    scrollTop();
  };

  const jump = (index: number) => {
    setSec(index);
    setPhase("intake");
    scrollTop();
  };

  const submit = async () => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const values = methods.getValues();
      await config.onSubmit(values, docs);
      clearDraft(config.role, user?.id);
      setPhase("submitted");
      scrollTop();
    } catch (err) {
      const message = err instanceof Error ? err.message : t("submitError");
      setSubmitError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[var(--surface-page)]">
      {/* Top bar */}
      <header className="border-b border-border bg-[var(--surface-header)]">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between px-4 py-3">
          <Logo height={32} />
          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSwitcher />
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="size-4" aria-hidden /> {t("saveAndExit")}
            </Link>
          </div>
        </div>
      </header>

      <div id="wizard-scroll" className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
        {phase === "submitted" ? (
          <SubmittedStep
            title={t("submittedTitle")}
            description={t("submittedDescription")}
            note={t("submittedNote")}
            continueLabel={t("submittedContinue")}
            onContinue={() => router.replace(config.doneRedirect)}
          />
        ) : phase === "review" ? (
          <ReviewStep
            steps={steps}
            values={methods.getValues()}
            title={config.reviewTitle}
            subtitle={config.reviewSubtitle}
            consentLabel={config.consentLabel}
            submitLabel={config.submitLabel}
            submittingLabel={config.submittingLabel}
            editLabel={config.editLabel}
            consent={consent}
            onConsentChange={setConsent}
            submitting={submitting}
            error={submitError}
            onEdit={jump}
            onSubmit={submit}
          />
        ) : (
          <>
            <StepBar
              steps={steps.map((s) => ({ id: s.id, label: s.label, badge: s.badge }))}
              current={sec}
              onJump={jump}
            />
            <div className="rounded-[var(--radius-base)] border border-border bg-card p-5 sm:p-7">
              <div className="mb-5">
                <span className="inline-block rounded-full bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-[var(--accent)]">
                  {t("section")} {step.badge}
                </span>
                <h1 className="mt-2 font-display text-xl font-semibold text-[var(--text-strong)]">
                  {step.title}
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">{step.subtitle}</p>
              </div>

              <div key={step.id}>{step.render()}</div>

              <div className="mt-7 flex items-center justify-between border-t border-border pt-5">
                <BrandedButton
                  type="button"
                  variant="ghost"
                  icon={ArrowLeft}
                  onClick={back}
                  disabled={sec === 0}
                  className={sec === 0 ? "invisible" : ""}
                >
                  {t("back")}
                </BrandedButton>
                <div className="flex items-center gap-4">
                  <SavedIndicator state={saved} savingLabel={t("saving")} savedLabel={t("saved")} />
                  <BrandedButton type="button" iconRight="arrow-right" onClick={next}>
                    {sec === steps.length - 1 ? t("review") : t("continue")}
                  </BrandedButton>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function SavedIndicator({
  state,
  savingLabel,
  savedLabel,
}: {
  state: "idle" | "saving" | "saved";
  savingLabel: string;
  savedLabel: string;
}) {
  if (state === "idle") return null;
  return (
    <span className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:inline-flex">
      {state === "saving" ? (
        <>
          <Loader2 className="size-3.5 animate-spin" aria-hidden /> {savingLabel}
        </>
      ) : (
        <>
          <Check className="size-3.5 text-[var(--accent)]" aria-hidden /> {savedLabel}
        </>
      )}
    </span>
  );
}
