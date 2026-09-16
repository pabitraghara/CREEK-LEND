"use client";

/**
 * Step 1 — Loan request, contact, residence and income (fields 1-32).
 *
 * Everything needed for a soft-pull pre-qualification decision. No SSN, no
 * driver's licence, no bank details are collected here.
 */

import { useEffect, useMemo, useState } from "react";

import {
  ACCOUNT_TYPES,
  EMPLOYMENT_STATUSES,
  HOUSING_STATUSES,
  INCOME_TYPES,
  LOAN_PURPOSES,
  NAME_SUFFIXES,
  PAY_FREQUENCIES,
  PURPOSE_REQUIRING_DETAIL,
  TIME_AT_ADDRESS,
  TIME_AT_JOB,
  deriveIncomeType,
  requiresEmployerDetails,
  requiresHousingPayment,
  requiresNextPayDate,
} from "@/lib/application/options";
import { US_STATES } from "@/lib/constants";
import type {
  ConsentDefinition,
  ConsentState,
  Step1Data,
} from "@/lib/application/types";
import {
  type Errors,
  emailSuggestion,
  formatCurrencyInput,
  formatPhoneInput,
  parseCurrency,
  validateStep1Field,
} from "@/lib/application/validate";
import { fetchQuote } from "@/lib/application/api";
import {
  CurrencyField,
  RadioField,
  SectionHeading,
  SelectField,
  TextField,
} from "./Fields";
import ConsentBlock from "./ConsentBlock";

interface Props {
  data: Step1Data;
  errors: Errors;
  consents: ConsentDefinition[];
  consentState: ConsentState;
  regBNotice: string;
  availableTerms: number[];
  amountRange: { min: number; max: number; increment: number };
  submitting: boolean;
  formError?: string;
  missingConsents?: string[];
  onChange: (updates: Partial<Step1Data>) => void;
  onBlurField: (field: keyof Step1Data) => void;
  onConsentChange: (type: string, checked: boolean) => void;
  onSubmit: () => void;
}

const DIRECT_DEPOSIT_OPTIONS = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

export default function Step1Request({
  data,
  errors,
  consents,
  consentState,
  regBNotice,
  availableTerms,
  amountRange,
  submitting,
  formError,
  missingConsents,
  onChange,
  onBlurField,
  onConsentChange,
  onSubmit,
}: Props) {
  const [installment, setInstallment] = useState<number | null>(null);
  const [emailHint, setEmailHint] = useState<string | null>(null);

  const showIncomeType = useMemo(
    () =>
      data.employmentStatus !== "" &&
      deriveIncomeType(data.employmentStatus) === null,
    [data.employmentStatus],
  );
  const showEmployer = requiresEmployerDetails(data.employmentStatus);
  const showHousingPayment = requiresHousingPayment(data.housingStatus);
  const showNextPayDate = requiresNextPayDate(data.payFrequency);
  const showAdditionalSource = parseCurrency(data.additionalMonthlyIncome) > 0;

  // The installment comes from the server so the browser never has to know
  // the APR, and the number quoted here is the number underwriting uses.
  useEffect(() => {
    let cancelled = false;
    fetchQuote(data.loanAmount, data.loanTerm).then((quote) => {
      if (!cancelled) setInstallment(quote?.estimatedInstallment ?? null);
    });
    return () => {
      cancelled = true;
    };
  }, [data.loanAmount, data.loanTerm]);

  // If the chosen term stops being offered (the amount or income changed),
  // fall back to one that is, rather than silently submitting an invalid term.
  useEffect(() => {
    if (availableTerms.length > 0 && !availableTerms.includes(data.loanTerm)) {
      onChange({ loanTerm: availableTerms[availableTerms.length - 1] });
    }
  }, [availableTerms, data.loanTerm, onChange]);

  const termOptions = availableTerms.map((term) => ({
    value: String(term),
    label: `${term} months`,
  }));

  return (
    <div className="space-y-8">
      {/* ---------------------------------------------------------------- */}
      {/* 1.1 Loan request                                                  */}
      {/* ---------------------------------------------------------------- */}
      <section className="space-y-5">
        <SectionHeading
          title="How much do you need?"
          description="Checking your rate uses a soft credit inquiry and won't affect your score."
        />

        <div>
          <div className="flex items-baseline justify-between mb-2">
            <label
              htmlFor="loanAmount"
              className="text-sm font-medium text-text-primary"
            >
              Loan Amount *
            </label>
            <output
              htmlFor="loanAmount"
              className="text-2xl font-bold text-primary"
            >
              ${data.loanAmount.toLocaleString("en-US")}
            </output>
          </div>
          <input
            id="loanAmount"
            type="range"
            min={amountRange.min}
            max={amountRange.max}
            step={amountRange.increment}
            value={data.loanAmount}
            onChange={(e) => onChange({ loanAmount: Number(e.target.value) })}
            className="w-full accent-primary"
            aria-valuetext={`$${data.loanAmount.toLocaleString("en-US")}`}
          />
          <div className="flex justify-between text-xs text-text-secondary mt-1">
            <span>${amountRange.min.toLocaleString("en-US")}</span>
            <span>${amountRange.max.toLocaleString("en-US")}</span>
          </div>
          {errors.loanAmount && (
            <p role="alert" className="text-error text-xs mt-1">
              {errors.loanAmount}
            </p>
          )}
        </div>

        <SelectField
          id="loanPurpose"
          label="What is the loan for?"
          required
          value={data.loanPurpose}
          options={LOAN_PURPOSES}
          onChange={(value) => onChange({ loanPurpose: value })}
          onBlur={() => onBlurField("loanPurpose")}
          error={errors.loanPurpose}
        />

        {data.loanPurpose === PURPOSE_REQUIRING_DETAIL && (
          <TextField
            id="loanPurposeOther"
            label="Please tell us more"
            required
            value={data.loanPurposeOther}
            onChange={(value) => onChange({ loanPurposeOther: value })}
            onBlur={() => onBlurField("loanPurposeOther")}
            error={errors.loanPurposeOther}
            maxLength={120}
            placeholder="e.g. Replacing a broken water heater"
            hint={`${data.loanPurposeOther.length}/120 characters`}
          />
        )}

        <SelectField
          id="loanTerm"
          label="Repayment term"
          required
          value={String(data.loanTerm)}
          options={termOptions}
          onChange={(value) => onChange({ loanTerm: Number(value) })}
          error={errors.loanTerm}
          placeholder="Select a term…"
          // hint={
          //   installment !== null
          //     ? `Estimated payment: $${installment.toLocaleString("en-US", {
          //         minimumFractionDigits: 2,
          //       })} per month. Final rate and payment are set after review.`
          //     : undefined
          // }
        />
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* 1.2 Applicant identity                                            */}
      {/* ---------------------------------------------------------------- */}
      <section className="space-y-5">
        <SectionHeading title="About you" />

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          <div className="sm:col-span-5">
            <TextField
              id="firstName"
              label="First Name"
              required
              value={data.firstName}
              onChange={(value) => onChange({ firstName: value })}
              onBlur={() => onBlurField("firstName")}
              error={errors.firstName}
              autoComplete="given-name"
              placeholder="John"
              maxLength={40}
            />
          </div>
          <div className="sm:col-span-2">
            <TextField
              id="middleInitial"
              label="M.I."
              value={data.middleInitial}
              onChange={(value) =>
                onChange({ middleInitial: value.slice(0, 1) })
              }
              onBlur={() => onBlurField("middleInitial")}
              error={errors.middleInitial}
              autoComplete="additional-name"
              maxLength={1}
            />
          </div>
          <div className="sm:col-span-5">
            <TextField
              id="lastName"
              label="Last Name"
              required
              value={data.lastName}
              onChange={(value) => onChange({ lastName: value })}
              onBlur={() => onBlurField("lastName")}
              error={errors.lastName}
              autoComplete="family-name"
              placeholder="Doe"
              maxLength={40}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <SelectField
            id="suffix"
            label="Suffix"
            value={data.suffix}
            options={NAME_SUFFIXES.filter((o) => o.value !== "")}
            onChange={(value) => onChange({ suffix: value })}
            placeholder="None"
          />
          <TextField
            id="dateOfBirth"
            label="Date of Birth"
            required
            type="date"
            value={data.dateOfBirth}
            onChange={(value) => onChange({ dateOfBirth: value })}
            onBlur={() => onBlurField("dateOfBirth")}
            error={errors.dateOfBirth}
            autoComplete="bday"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <TextField
            id="email"
            label="Email Address"
            required
            type="email"
            inputMode="email"
            value={data.email}
            onChange={(value) => {
              onChange({ email: value });
              setEmailHint(null);
            }}
            onBlur={() => {
              onBlurField("email");
              setEmailHint(emailSuggestion(data.email));
            }}
            error={errors.email}
            autoComplete="email"
            placeholder="john.doe@email.com"
            hint={
              emailHint ? (
                <span>
                  Did you mean{" "}
                  <button
                    type="button"
                    className="text-primary underline"
                    onClick={() => {
                      onChange({ email: emailHint });
                      setEmailHint(null);
                    }}
                  >
                    {emailHint}
                  </button>
                  ?
                </span>
              ) : undefined
            }
          />
          <TextField
            id="confirmEmail"
            label="Confirm Email"
            required
            type="email"
            inputMode="email"
            value={data.confirmEmail}
            onChange={(value) => onChange({ confirmEmail: value })}
            onBlur={() => onBlurField("confirmEmail")}
            error={errors.confirmEmail}
            autoComplete="off"
            blockPaste
            placeholder="john.doe@email.com"
          />
        </div>

        <TextField
          id="phone"
          label="Mobile Phone"
          required
          type="tel"
          inputMode="tel"
          value={data.phone}
          onChange={(value) => onChange({ phone: formatPhoneInput(value) })}
          onBlur={() => onBlurField("phone")}
          error={errors.phone}
          autoComplete="tel-national"
          placeholder="(555) 123-4567"
        />
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* 1.3 Residence                                                     */}
      {/* ---------------------------------------------------------------- */}
      <section className="space-y-5">
        <SectionHeading title="Where do you live?" />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="sm:col-span-2">
            <TextField
              id="streetAddress"
              label="Street Address"
              required
              value={data.streetAddress}
              onChange={(value) => onChange({ streetAddress: value })}
              onBlur={() => onBlurField("streetAddress")}
              error={errors.streetAddress}
              autoComplete="address-line1"
              placeholder="1234 Market Street"
              maxLength={100}
            />
          </div>
          <TextField
            id="addressUnit"
            label="Apt / Unit / Suite"
            value={data.addressUnit}
            onChange={(value) => onChange({ addressUnit: value })}
            autoComplete="address-line2"
            placeholder="Apt 5B"
            maxLength={20}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <TextField
            id="city"
            label="City"
            required
            value={data.city}
            onChange={(value) => onChange({ city: value })}
            onBlur={() => onBlurField("city")}
            error={errors.city}
            autoComplete="address-level2"
            placeholder="San Francisco"
            maxLength={50}
          />
          <SelectField
            id="state"
            label="State"
            required
            value={data.state}
            options={US_STATES}
            onChange={(value) => onChange({ state: value })}
            onBlur={() => onBlurField("state")}
            error={errors.state}
          />
          <TextField
            id="zipCode"
            label="ZIP Code"
            required
            inputMode="numeric"
            value={data.zipCode}
            onChange={(value) =>
              onChange({ zipCode: value.replace(/\D/g, "").slice(0, 5) })
            }
            onBlur={() => onBlurField("zipCode")}
            error={errors.zipCode}
            autoComplete="postal-code"
            placeholder="94103"
            maxLength={5}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <SelectField
            id="timeAtAddress"
            label="Time at this address"
            required
            value={data.timeAtAddress}
            options={TIME_AT_ADDRESS}
            onChange={(value) => onChange({ timeAtAddress: value })}
            onBlur={() => onBlurField("timeAtAddress")}
            error={errors.timeAtAddress}
          />
          <SelectField
            id="housingStatus"
            label="Housing status"
            required
            value={data.housingStatus}
            options={HOUSING_STATUSES}
            onChange={(value) => onChange({ housingStatus: value })}
            onBlur={() => onBlurField("housingStatus")}
            error={errors.housingStatus}
          />
        </div>

        {showHousingPayment && (
          <CurrencyField
            id="monthlyHousingPayment"
            label="Monthly housing payment"
            required
            value={data.monthlyHousingPayment}
            onChange={(value) => onChange({ monthlyHousingPayment: value })}
            onBlur={() => {
              onChange({
                monthlyHousingPayment: formatCurrencyInput(
                  data.monthlyHousingPayment,
                ),
              });
              onBlurField("monthlyHousingPayment");
            }}
            error={errors.monthlyHousingPayment}
            placeholder="1,500"
          />
        )}
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* 1.4 Employment and income                                         */}
      {/* ---------------------------------------------------------------- */}
      <section className="space-y-5">
        <SectionHeading title="Employment and income" />

        {/*
          Reg B notice. Must render immediately above this section, before any
          income field — not in a footer, not behind a link.
        */}
        <p className="text-xs text-text-secondary bg-surface border border-surface-dark rounded-lg px-3 py-2.5">
          {regBNotice}
        </p>

        <SelectField
          id="employmentStatus"
          label="Employment status"
          required
          value={data.employmentStatus}
          options={EMPLOYMENT_STATUSES}
          onChange={(value) =>
            onChange({
              employmentStatus: value,
              // Clear employer fields when they stop being shown, so a status
              // change can't leave a stale employer attached to the record.
              ...(requiresEmployerDetails(value)
                ? {}
                : {
                    employerName: "",
                    jobTitle: "",
                    employerPhone: "",
                    timeAtJob: "",
                  }),
              ...(deriveIncomeType(value) ? { primaryIncomeType: "" } : {}),
            })
          }
          onBlur={() => onBlurField("employmentStatus")}
          error={errors.employmentStatus}
        />

        {showIncomeType && (
          <SelectField
            id="primaryIncomeType"
            label="Primary source of income"
            required
            value={data.primaryIncomeType}
            options={INCOME_TYPES}
            onChange={(value) => onChange({ primaryIncomeType: value })}
            onBlur={() => onBlurField("primaryIncomeType")}
            error={errors.primaryIncomeType}
          />
        )}

        {showEmployer && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <TextField
                id="employerName"
                label="Employer name"
                required
                value={data.employerName}
                onChange={(value) => onChange({ employerName: value })}
                onBlur={() => onBlurField("employerName")}
                error={errors.employerName}
                autoComplete="organization"
                maxLength={60}
              />
              <TextField
                id="jobTitle"
                label="Job title"
                required
                value={data.jobTitle}
                onChange={(value) => onChange({ jobTitle: value })}
                onBlur={() => onBlurField("jobTitle")}
                error={errors.jobTitle}
                autoComplete="organization-title"
                maxLength={50}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <TextField
                id="employerPhone"
                label="Employer phone"
                required
                type="tel"
                inputMode="tel"
                value={data.employerPhone}
                onChange={(value) =>
                  onChange({ employerPhone: formatPhoneInput(value) })
                }
                onBlur={() => onBlurField("employerPhone")}
                error={errors.employerPhone}
                placeholder="(555) 123-4567"
              />
              <SelectField
                id="timeAtJob"
                label="Time at this job"
                required
                value={data.timeAtJob}
                options={TIME_AT_JOB}
                onChange={(value) => onChange({ timeAtJob: value })}
                onBlur={() => onBlurField("timeAtJob")}
                error={errors.timeAtJob}
              />
            </div>
          </>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <CurrencyField
            id="netMonthlyIncome"
            label="Net monthly income"
            required
            value={data.netMonthlyIncome}
            onChange={(value) => onChange({ netMonthlyIncome: value })}
            onBlur={() => {
              onChange({
                netMonthlyIncome: formatCurrencyInput(data.netMonthlyIncome),
              });
              onBlurField("netMonthlyIncome");
            }}
            error={errors.netMonthlyIncome}
            placeholder="4,000"
            hint="Your take-home pay after taxes and deductions."
          />
          <SelectField
            id="payFrequency"
            label="How often are you paid?"
            required
            value={data.payFrequency}
            options={PAY_FREQUENCIES}
            onChange={(value) =>
              onChange({
                payFrequency: value,
                ...(requiresNextPayDate(value) ? {} : { nextPayDate: "" }),
              })
            }
            onBlur={() => onBlurField("payFrequency")}
            error={errors.payFrequency}
          />
        </div>

        {showNextPayDate && (
          <TextField
            id="nextPayDate"
            label="Next pay date"
            required
            type="date"
            value={data.nextPayDate}
            onChange={(value) => onChange({ nextPayDate: value })}
            onBlur={() => onBlurField("nextPayDate")}
            error={errors.nextPayDate}
          />
        )}

        <RadioField
          id="directDeposit"
          label="Is your income deposited directly into your bank account?"
          required
          value={data.directDeposit}
          options={DIRECT_DEPOSIT_OPTIONS}
          onChange={(value) => onChange({ directDeposit: value })}
          error={errors.directDeposit}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <CurrencyField
            id="additionalMonthlyIncome"
            label="Additional monthly income"
            value={data.additionalMonthlyIncome}
            onChange={(value) => onChange({ additionalMonthlyIncome: value })}
            onBlur={() => {
              onChange({
                additionalMonthlyIncome: formatCurrencyInput(
                  data.additionalMonthlyIncome,
                ),
              });
              onBlurField("additionalMonthlyIncome");
            }}
            error={errors.additionalMonthlyIncome}
            placeholder="0"
            hint="Optional."
          />
          {showAdditionalSource && (
            <TextField
              id="additionalIncomeSource"
              label="Source of additional income"
              required
              value={data.additionalIncomeSource}
              onChange={(value) => onChange({ additionalIncomeSource: value })}
              onBlur={() => onBlurField("additionalIncomeSource")}
              error={errors.additionalIncomeSource}
              maxLength={50}
              placeholder="e.g. Rental income"
            />
          )}
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Consents — immediately above submit                               */}
      {/* ---------------------------------------------------------------- */}
      <section className="space-y-4">
        <SectionHeading title="Your authorizations" />
        <ConsentBlock
          consents={consents}
          state={consentState}
          onChange={onConsentChange}
          missing={missingConsents}
        />
      </section>

      {formError && (
        <p
          role="alert"
          className="text-error text-sm bg-error/5 border border-error/20 rounded-lg px-4 py-3"
        >
          {formError}
        </p>
      )}

      <button
        type="button"
        onClick={onSubmit}
        disabled={submitting}
        className="w-full bg-primary hover:bg-primary-dark disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-lg transition-colors"
      >
        {submitting ? "Checking your rate…" : "Check My Rate"}
      </button>

      <p className="text-xs text-text-secondary text-center">
        Checking your rate uses a soft credit inquiry and will not affect your
        credit score.
      </p>
    </div>
  );
}
