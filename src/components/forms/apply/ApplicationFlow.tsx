"use client";

/**
 * The three-step application.
 *
 * Each step submits and saves on its own, so a drop-off after Step 1 still
 * leaves a usable lead. Form state is mirrored into localStorage on every
 * change, which is what makes back-navigation lossless and lets a resumed
 * session pick up where it left off.
 *
 * Sensitive values are the exception: SSN, licence and account numbers are
 * held in React state only and never written to storage. A resumed session
 * re-collects them.
 */

import { useCallback, useEffect, useMemo, useState } from "react";

import { deriveIncomeType, PRODUCT } from "@/lib/application/options";
import {
  emptyStep1,
  emptyStep2,
  emptyStep3,
  type ApplyConfig,
  type ConsentState,
  type Step1Data,
  type Step2Data,
  type Step3Data,
  type StepResponse,
} from "@/lib/application/types";
import {
  type Errors,
  parseCurrency,
  validateStep1,
  validateStep1Field,
  validateStep2,
  validateStep3,
} from "@/lib/application/validate";
import {
  fetchConfig,
  resumeApplication,
  submitStep1,
  submitStep2,
  submitStep3,
} from "@/lib/application/api";
import {
  captureFirstTouch,
  markFormStarted,
  scrubResumeTokenFromAddressBar,
  timezoneOffset,
  trackingPayload,
} from "@/lib/application/tracking";

import ProgressBar from "./ProgressBar";
import Step1Request from "./Step1Request";
import Step2Identity from "./Step2Identity";
import Step3Banking from "./Step3Banking";

const DRAFT_KEY = "cl_application_draft";

interface Draft {
  step: number;
  applicationId: string;
  step1: Step1Data;
}

function readDraft(): Draft | null {
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    return raw ? (JSON.parse(raw) as Draft) : null;
  } catch {
    return null;
  }
}

function writeDraft(draft: Draft): void {
  try {
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch {
    // Storage unavailable — the form still works, it just won't survive a reload.
  }
}

function clearDraft(): void {
  try {
    window.localStorage.removeItem(DRAFT_KEY);
  } catch {
    // no-op
  }
}

/**
 * Maps a resumed application row back onto the form's Step 1 shape.
 *
 * Only Step 1 is restored. The identity and bank fields are never returned by
 * the server, so a resumed applicant re-enters them.
 */
function mergeResumed(
  base: Step1Data,
  app: Record<string, unknown>,
): Step1Data {
  const text = (key: string): string => {
    const value = app[key];
    return typeof value === "string" ? value : "";
  };
  const money = (key: string): string => {
    const value = app[key];
    return typeof value === "number" && value > 0
      ? value.toLocaleString("en-US")
      : "";
  };

  return {
    ...base,
    loanAmount:
      typeof app.loan_amount === "number" ? app.loan_amount : base.loanAmount,
    loanPurpose: text("loan_purpose"),
    loanPurposeOther: text("loan_purpose_other"),
    loanTerm: typeof app.loan_term === "number" ? app.loan_term : base.loanTerm,
    firstName: text("first_name"),
    middleInitial: text("middle_initial"),
    lastName: text("last_name"),
    suffix: text("name_suffix"),
    email: text("email"),
    confirmEmail: text("email"),
    phone: text("phone"),
    dateOfBirth: text("date_of_birth"),
    streetAddress: text("street_address"),
    addressUnit: text("address_unit"),
    city: text("city"),
    state: text("state"),
    zipCode: text("zip_code"),
    timeAtAddress: text("time_at_address"),
    housingStatus: text("housing_status"),
    monthlyHousingPayment: money("monthly_housing_payment"),
    employmentStatus: text("employment_status"),
    primaryIncomeType: text("primary_income_type"),
    employerName: text("employer_name"),
    jobTitle: text("job_title"),
    employerPhone: text("employer_phone"),
    timeAtJob: text("time_at_job"),
    netMonthlyIncome: money("monthly_income"),
    payFrequency: text("pay_frequency"),
    nextPayDate: text("next_pay_date"),
    directDeposit:
      app.direct_deposit === true
        ? "yes"
        : app.direct_deposit === false
          ? "no"
          : "",
    additionalMonthlyIncome: money("additional_monthly_income"),
    additionalIncomeSource: text("additional_income_source"),
  };
}

type Outcome =
  | { kind: "declined"; message: string }
  | { kind: "submitted"; applicationId: string; message: string };

export default function ApplicationFlow() {
  const [step, setStep] = useState(1);
  const [applicationId, setApplicationId] = useState("");
  const [config, setConfig] = useState<ApplyConfig | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const [step1, setStep1] = useState<Step1Data>(emptyStep1);
  const [step2, setStep2] = useState<Step2Data>(emptyStep2);
  const [step3, setStep3] = useState<Step3Data>(emptyStep3);

  const [consentState, setConsentState] = useState<ConsentState>({});
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string>();
  const [missingConsents, setMissingConsents] = useState<string[]>();
  const [submitting, setSubmitting] = useState(false);
  const [outcome, setOutcome] = useState<Outcome | null>(null);

  // -------------------------------------------------------------------------
  // Boot: attribution, saved draft, and server config.
  // -------------------------------------------------------------------------
  useEffect(() => {
    captureFirstTouch();
    markFormStarted();

    // A resume link wins over any local draft: it is the applicant coming back
    // from the email we sent, and the server's copy is the authoritative one.
    const params = new URLSearchParams(window.location.search);
    const resumeId = params.get("app");
    const resumeToken = params.get("resume");

    if (resumeId && resumeToken) {
      resumeApplication(resumeId, resumeToken).then((result) => {
        if (result.success && result.application) {
          const app = result.application;
          // The token has done its job; take it out of the address bar.
          scrubResumeTokenFromAddressBar();
          setApplicationId(app.id);
          setStep1((previous) => mergeResumed(previous, app));
          if (app.current_step >= 4) {
            // Already through Step 3. Confirm rather than ask for bank
            // details a second time.
            setOutcome({
              kind: "submitted",
              applicationId: app.id,
              message:
                "We have everything we need and we'll be in touch shortly.",
            });
          } else {
            setStep(Math.min(Math.max(app.current_step, 1), 3));
          }
        } else {
          setFormError(
            result.error ??
              "That link is no longer valid. Please start a new application.",
          );
        }
        setHydrated(true);
      });
      return;
    }

    const draft = readDraft();
    if (draft) {
      setStep1(draft.step1);
      setApplicationId(draft.applicationId);
      setStep(draft.step);
    }
    setHydrated(true);
  }, []);

  // Config drives the amount range and which terms are offered, both of which
  // depend on the applicant's state and income.
  useEffect(() => {
    if (!hydrated) return;

    let cancelled = false;
    fetchConfig({
      state: step1.state || undefined,
      amount: step1.loanAmount,
      income: parseCurrency(step1.netMonthlyIncome) || undefined,
    }).then((result) => {
      if (!cancelled && result) setConfig(result);
    });

    return () => {
      cancelled = true;
    };
  }, [hydrated, step1.state, step1.loanAmount, step1.netMonthlyIncome]);

  // Persist Step 1 on every change. Steps 2 and 3 are deliberately excluded.
  //
  // An outcome — submitted or declined — is the end of the road, so the draft
  // is dropped rather than rewritten. Doing it here rather than in the submit
  // handlers keeps a later state change from resurrecting a finished draft,
  // and covers the resume link that lands straight on the success panel.
  useEffect(() => {
    if (!hydrated) return;

    if (outcome) {
      clearDraft();
      return;
    }

    writeDraft({ step, applicationId, step1 });
  }, [hydrated, outcome, step, applicationId, step1]);

  // -------------------------------------------------------------------------
  // Field handlers
  // -------------------------------------------------------------------------
  /**
   * Re-checks the fields that are currently showing an error against the new
   * state, and drops the ones that now pass.
   *
   * Without this, fixing one field can leave another field's error stranded:
   * correcting a mistyped email address makes it match the confirmation
   * again, but the "Email addresses don't match" error stays on screen — and
   * keeps blocking submit — until the applicant happens to touch the confirm
   * field a second time. Only clearing errors here, never adding them, keeps
   * this from scolding someone mid-keystroke.
   */
  const clearResolvedErrors = useCallback((next: Step1Data) => {
    setErrors((previous) => {
      const updated = { ...previous };
      let changed = false;

      for (const field of Object.keys(previous) as Array<keyof Step1Data>) {
        if (validateStep1Field(field, next) === null) {
          delete updated[field];
          changed = true;
        }
      }

      return changed ? updated : previous;
    });
  }, []);

  const updateStep1 = useCallback(
    (updates: Partial<Step1Data>) => {
      setStep1((previous) => {
        const next = { ...previous, ...updates };
        clearResolvedErrors(next);
        return next;
      });
    },
    [clearResolvedErrors],
  );

  const showIncomeType =
    step1.employmentStatus !== "" &&
    deriveIncomeType(step1.employmentStatus) === null;

  /** Inline validation on blur — never on submit alone, never clearing the field. */
  const blurStep1 = useCallback((field: keyof Step1Data) => {
    setStep1((current) => {
      const message = validateStep1Field(field, current);
      setErrors((previous) => {
        const next = { ...previous };
        if (message) next[field] = message;
        else delete next[field];
        return next;
      });
      return current;
    });
  }, []);

  const blurStep2 = useCallback((field: keyof Step2Data) => {
    setStep2((current) => {
      const found = validateStep2(current)[field];
      setErrors((previous) => {
        const next = { ...previous };
        if (found) next[field] = found;
        else delete next[field];
        return next;
      });
      return current;
    });
  }, []);

  const blurStep3 = useCallback((field: keyof Step3Data) => {
    setStep3((current) => {
      const found = validateStep3(current)[field];
      setErrors((previous) => {
        const next = { ...previous };
        if (found) next[field] = found;
        else delete next[field];
        return next;
      });
      return current;
    });
  }, []);

  const changeConsent = useCallback((type: string, checked: boolean) => {
    setConsentState((previous) => ({ ...previous, [type]: checked }));
    setMissingConsents((previous) => previous?.filter((t) => t !== type));
  }, []);

  const consentsForStep = useMemo(
    () => (config?.consents ?? []).filter((consent) => consent.step === step),
    [config, step],
  );

  /** Consent payload: what was ticked, and the version of the text shown. */
  function consentPayload() {
    const tz = timezoneOffset();
    return consentsForStep.map((consent) => ({
      type: consent.type,
      version: consent.version,
      checked: consentState[consent.type] ?? false,
      timezoneOffset: tz,
    }));
  }

  /** Maps a server response onto the form's error state. */
  function applyServerErrors(response: StepResponse): void {
    if (response.errors?.length) {
      const mapped: Errors = {};
      for (const item of response.errors) mapped[item.field] = item.message;
      setErrors(mapped);

      // Put the first bad field on screen rather than leaving the applicant
      // to hunt for it.
      const first = response.errors[0].field;
      requestAnimationFrame(() => {
        document
          .getElementById(first)
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
        document.getElementById(first)?.focus({ preventScroll: true });
      });
    }
    setMissingConsents(response.missingConsents);
    setFormError(response.error);
  }

  // -------------------------------------------------------------------------
  // Submission
  // -------------------------------------------------------------------------
  async function handleStep1Submit() {
    setFormError(undefined);

    const found = validateStep1(step1, showIncomeType);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      const first = Object.keys(found)[0];
      document
        .getElementById(first)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setErrors({});

    setSubmitting(true);
    const response = await submitStep1({
      ...trackingPayload(),
      loanAmount: step1.loanAmount,
      loanPurpose: step1.loanPurpose,
      loanPurposeOther: step1.loanPurposeOther,
      loanTerm: step1.loanTerm,
      firstName: step1.firstName,
      middleInitial: step1.middleInitial,
      lastName: step1.lastName,
      suffix: step1.suffix,
      email: step1.email,
      confirmEmail: step1.confirmEmail,
      phone: step1.phone,
      dateOfBirth: step1.dateOfBirth,
      streetAddress: step1.streetAddress,
      addressUnit: step1.addressUnit,
      city: step1.city,
      state: step1.state,
      zipCode: step1.zipCode,
      timeAtAddress: step1.timeAtAddress,
      housingStatus: step1.housingStatus,
      monthlyHousingPayment: parseCurrency(step1.monthlyHousingPayment),
      employmentStatus: step1.employmentStatus,
      primaryIncomeType: step1.primaryIncomeType,
      employerName: step1.employerName,
      jobTitle: step1.jobTitle,
      employerPhone: step1.employerPhone,
      timeAtJob: step1.timeAtJob,
      netMonthlyIncome: parseCurrency(step1.netMonthlyIncome),
      payFrequency: step1.payFrequency,
      nextPayDate: step1.nextPayDate,
      directDeposit: step1.directDeposit === "yes",
      additionalMonthlyIncome: parseCurrency(step1.additionalMonthlyIncome),
      additionalIncomeSource: step1.additionalIncomeSource,
      consents: consentPayload(),
    });
    setSubmitting(false);

    // A person already mid-application is sent onward rather than duplicated.
    if (response.code === "application_in_progress" && response.applicationId) {
      setApplicationId(response.applicationId);
      setStep(Math.min(response.currentStep ?? 2, 3));
      setErrors({});
      setFormError(undefined);
      return;
    }

    if (response.decision === "decline") {
      setOutcome({ kind: "declined", message: response.message ?? "" });
      return;
    }

    if (!response.success || !response.applicationId) {
      applyServerErrors(response);
      return;
    }

    setApplicationId(response.applicationId);
    setConsentState({});
    setErrors({});
    setFormError(undefined);
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleStep2Submit() {
    setFormError(undefined);

    const found = validateStep2(step2);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      return;
    }
    setErrors({});

    setSubmitting(true);
    const response = await submitStep2({
      ...trackingPayload(),
      applicationId,
      ssn: step2.ssn,
      confirmSsn: step2.confirmSsn,
      driverLicenseNumber: step2.driverLicenseNumber,
      driverLicenseState: step2.driverLicenseState,
      dlExpirationDate: step2.dlExpirationDate,
      consents: consentPayload(),
    });
    setSubmitting(false);

    if (!response.success) {
      applyServerErrors(response);
      return;
    }

    // The identity fields are dropped from memory as soon as the server has
    // them; only the step marker moves forward into the draft.
    setStep2(emptyStep2);
    setConsentState({});
    setErrors({});
    setFormError(undefined);
    setStep(3);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleStep3Submit() {
    setFormError(undefined);

    const found = validateStep3(step3);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      return;
    }
    setErrors({});

    setSubmitting(true);
    const response = await submitStep3({
      ...trackingPayload(),
      applicationId,
      routingNumber: step3.routingNumber,
      bankName: step3.bankName,
      accountNumber: step3.accountNumber,
      confirmAccountNumber: step3.confirmAccountNumber,
      accountType: step3.accountType,
      accountStatus: step3.accountStatus,
      accountAge: step3.accountAge,
      consents: consentPayload(),
    });
    setSubmitting(false);

    if (!response.success) {
      applyServerErrors(response);
      return;
    }

    setStep3(emptyStep3);
    setOutcome({
      kind: "submitted",
      applicationId,
      message: response.message ?? "",
    });
  }

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------
  if (!hydrated) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-surface-dark p-6 sm:p-8">
        <div
          className="animate-pulse space-y-4"
          aria-label="Loading application form"
        >
          <div className="h-2 bg-surface-dark rounded w-full" />
          <div className="h-10 bg-surface-dark rounded w-2/3" />
          <div className="h-10 bg-surface-dark rounded" />
          <div className="h-10 bg-surface-dark rounded" />
        </div>
      </div>
    );
  }

  if (outcome) {
    return <OutcomePanel outcome={outcome} />;
  }

  const amountRange = config?.stateRange ?? {
    min: PRODUCT.minAmount,
    max: PRODUCT.maxAmount,
    increment: PRODUCT.increment,
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-surface-dark p-6 sm:p-8">
      <ProgressBar currentStep={step} />

      {step === 1 && (
        <Step1Request
          data={step1}
          errors={errors}
          consents={consentsForStep}
          consentState={consentState}
          regBNotice={config?.regBNotice ?? ""}
          availableTerms={config?.availableTerms ?? [12, 24, 36, 48]}
          amountRange={amountRange}
          submitting={submitting}
          formError={formError}
          missingConsents={missingConsents}
          onChange={updateStep1}
          onBlurField={blurStep1}
          onConsentChange={changeConsent}
          onSubmit={handleStep1Submit}
        />
      )}

      {step === 2 && (
        <Step2Identity
          data={step2}
          errors={errors}
          consents={consentsForStep}
          consentState={consentState}
          applicationId={applicationId}
          submitting={submitting}
          formError={formError}
          missingConsents={missingConsents}
          onChange={(updates) =>
            setStep2((previous) => {
              const next = { ...previous, ...updates };
              const remaining = validateStep2(next);
              setErrors((current) => {
                const updated = { ...current };
                for (const field of Object.keys(current)) {
                  if (!remaining[field]) delete updated[field];
                }
                return updated;
              });
              return next;
            })
          }
          onBlurField={blurStep2}
          onConsentChange={changeConsent}
          onSubmit={handleStep2Submit}
        />
      )}

      {step === 3 && (
        <Step3Banking
          data={step3}
          errors={errors}
          consents={consentsForStep}
          consentState={consentState}
          applicationId={applicationId}
          submitting={submitting}
          formError={formError}
          missingConsents={missingConsents}
          onChange={(updates) =>
            setStep3((previous) => {
              const next = { ...previous, ...updates };
              const remaining = validateStep3(next);
              setErrors((current) => {
                const updated = { ...current };
                for (const field of Object.keys(current)) {
                  if (!remaining[field]) delete updated[field];
                }
                return updated;
              });
              return next;
            })
          }
          onBlurField={blurStep3}
          onConsentChange={changeConsent}
          onSubmit={handleStep3Submit}
        />
      )}
    </div>
  );
}

function OutcomePanel({ outcome }: { outcome: Outcome }) {
  if (outcome.kind === "declined") {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-surface-dark p-8 text-center">
        <h2 className="text-xl font-bold text-text-primary mb-2">
          We can&apos;t offer you a loan right now
        </h2>
        <p className="text-sm text-text-secondary max-w-md mx-auto">
          {outcome.message}
        </p>
        <p className="text-xs text-text-secondary mt-4">
          You have the right to a written statement of the specific reasons for
          this decision. Contact us at (747) 202-2934.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-surface-dark p-8 text-center">
      <div className="text-4xl mb-3" aria-hidden="true">
        🎉
      </div>
      <h2 className="text-xl font-bold text-text-primary mb-2">
        Your application is complete
      </h2>
      <p className="text-sm text-text-secondary max-w-md mx-auto">
        {outcome.message}
      </p>
      <p className="text-sm text-text-primary mt-4">
        Application ID: <strong>{outcome.applicationId}</strong>
      </p>
      <p className="text-xs text-text-secondary mt-1">
        Save this ID — you can use it to check your status at any time.
      </p>
    </div>
  );
}
