"use client";

import { useState } from "react";
import type { ApplicationData } from "../ApplicationWizard";
import { LOAN_PURPOSES, LOAN_LIMITS } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";

interface Props {
  data: ApplicationData;
  updateData: (updates: Partial<ApplicationData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function StepLoanDetails({
  data,
  updateData,
  onNext,
  onBack,
}: Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleNext = () => {
    const fieldErrors: Record<string, string> = {};

    if (
      data.loanAmount < LOAN_LIMITS.minAmount ||
      data.loanAmount > LOAN_LIMITS.maxAmount
    ) {
      fieldErrors.loanAmount = `Loan amount must be between ${formatCurrency(LOAN_LIMITS.minAmount)} and ${formatCurrency(LOAN_LIMITS.maxAmount)}`;
    }
    if (!data.loanPurpose) {
      fieldErrors.loanPurpose = "Please select a loan purpose";
    }
    if (!data.loanTerm) {
      fieldErrors.loanTerm = "Please select a loan term";
    }

    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    onNext();
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-text-primary mb-1">Loan Details</h2>
      <p className="text-sm text-text-secondary mb-6">
        Tell us about the loan you&apos;re looking for.
      </p>

      <div className="space-y-5">
        {/* 10% APR Trust Note */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3">
          <p className="text-sm text-emerald-700 font-medium">
            Our fixed 10% APR means your rate never changes based on your credit
            score.
          </p>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label
              htmlFor="loanAmount"
              className="text-sm font-medium text-text-primary"
            >
              Loan Amount *
            </label>
            <span className="text-lg font-bold text-primary">
              {formatCurrency(data.loanAmount)}
            </span>
          </div>
          <input
            type="range"
            id="loanAmount"
            min={LOAN_LIMITS.minAmount}
            max={LOAN_LIMITS.maxAmount}
            step={500}
            value={data.loanAmount}
            onChange={(e) => updateData({ loanAmount: Number(e.target.value) })}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-text-secondary mt-1">
            <span>{formatCurrency(LOAN_LIMITS.minAmount)}</span>
            <span>{formatCurrency(LOAN_LIMITS.maxAmount)}</span>
          </div>
          {errors.loanAmount && (
            <p className="text-error text-xs mt-1">{errors.loanAmount}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="loanPurpose"
            className="block text-sm font-medium text-text-primary mb-1.5"
          >
            Loan Purpose *
          </label>
          <select
            id="loanPurpose"
            value={data.loanPurpose}
            onChange={(e) => updateData({ loanPurpose: e.target.value })}
            className={`w-full px-4 py-3 border rounded-lg transition-colors ${
              errors.loanPurpose
                ? "border-error"
                : "border-surface-dark focus:border-primary"
            }`}
          >
            <option value="">Select purpose</option>
            {LOAN_PURPOSES.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
          {errors.loanPurpose && (
            <p className="text-error text-xs mt-1">{errors.loanPurpose}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-3">
            Loan Term *
          </label>
          <div className="grid grid-cols-5 gap-3">
            {[24, 36, 48, 60].map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => updateData({ loanTerm: term })}
                className={`py-3 rounded-lg text-sm font-semibold border-2 transition-all ${
                  data.loanTerm === term
                    ? "border-primary bg-primary text-white"
                    : "border-surface-dark bg-white text-text-secondary hover:border-primary/50"
                }`}
              >
                {term} mo
              </button>
            ))}
          </div>
          {errors.loanTerm && (
            <p className="text-error text-xs mt-1">{errors.loanTerm}</p>
          )}
          <p className="text-xs text-text-secondary mt-2">
            Choose a repayment term from 24 to 60 months to fit your lifestyle.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-end gap-3 mb-2">
          <span className="flex items-center gap-1 text-xs text-text-secondary">
            <svg
              className="w-3.5 h-3.5 text-success"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
            Your data is protected by bank-level security
          </span>
        </div>
        <div className="flex justify-between">
          <button
            type="button"
            onClick={onBack}
            className="text-text-secondary hover:text-text-primary font-medium px-6 py-3 transition-colors"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
