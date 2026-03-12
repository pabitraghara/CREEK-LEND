"use client";

import { useState } from "react";
import Link from "next/link";
import type { ApplicationData } from "../ApplicationWizard";
import { maskSSN, maskAccountNumber, formatCurrency } from "@/lib/utils";
import { LOAN_PURPOSES, SITE_NAME } from "@/lib/constants";

interface Props {
  data: ApplicationData;
  updateData: (updates: Partial<ApplicationData>) => void;
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export default function StepConsent({ data, updateData, onBack, onSubmit, isSubmitting }: Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = () => {
    const fieldErrors: Record<string, string> = {};
    if (!data.tcpaConsent) fieldErrors.tcpaConsent = "TCPA consent is required";
    if (!data.privacyConsent) fieldErrors.privacyConsent = "Privacy Policy agreement is required";
    if (!data.creditCheckConsent) fieldErrors.creditCheckConsent = "Credit check consent is required";

    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    onSubmit();
  };

  const purposeLabel = LOAN_PURPOSES.find((p) => p.value === data.loanPurpose)?.label || data.loanPurpose;

  return (
    <div>
      <h2 className="text-xl font-bold text-text-primary mb-1">
        Review & Submit
      </h2>
      <p className="text-sm text-text-secondary mb-6">
        Please review your information and agree to the terms below.
      </p>

      {/* Application Summary */}
      <div className="space-y-4 mb-8">
        <div className="bg-surface rounded-xl p-5">
          <h3 className="text-sm font-semibold text-primary mb-3">Personal Information</h3>
          <div className="grid grid-cols-2 gap-y-2 text-sm">
            <span className="text-text-secondary">Name</span>
            <span className="text-text-primary font-medium">{data.firstName} {data.lastName}</span>
            <span className="text-text-secondary">Email</span>
            <span className="text-text-primary font-medium">{data.email}</span>
            <span className="text-text-secondary">Phone</span>
            <span className="text-text-primary font-medium">{data.phone}</span>
            <span className="text-text-secondary">DOB</span>
            <span className="text-text-primary font-medium">{data.dateOfBirth}</span>
          </div>
        </div>

        <div className="bg-surface rounded-xl p-5">
          <h3 className="text-sm font-semibold text-primary mb-3">Identification</h3>
          <div className="grid grid-cols-2 gap-y-2 text-sm">
            <span className="text-text-secondary">SSN</span>
            <span className="text-text-primary font-medium">{maskSSN(data.ssn)}</span>
            <span className="text-text-secondary">DL Number</span>
            <span className="text-text-primary font-medium">{data.driverLicenseNumber}</span>
          </div>
        </div>

        <div className="bg-surface rounded-xl p-5">
          <h3 className="text-sm font-semibold text-primary mb-3">Loan Details</h3>
          <div className="grid grid-cols-2 gap-y-2 text-sm">
            <span className="text-text-secondary">Amount</span>
            <span className="text-text-primary font-medium">{formatCurrency(data.loanAmount)}</span>
            <span className="text-text-secondary">Purpose</span>
            <span className="text-text-primary font-medium">{purposeLabel}</span>
            <span className="text-text-secondary">Term</span>
            <span className="text-text-primary font-medium">{data.loanTerm} months</span>
          </div>
        </div>

        <div className="bg-surface rounded-xl p-5">
          <h3 className="text-sm font-semibold text-primary mb-3">Banking</h3>
          <div className="grid grid-cols-2 gap-y-2 text-sm">
            <span className="text-text-secondary">Bank</span>
            <span className="text-text-primary font-medium">{data.bankName}</span>
            <span className="text-text-secondary">Account</span>
            <span className="text-text-primary font-medium">{maskAccountNumber(data.accountNumber)}</span>
            <span className="text-text-secondary">Type</span>
            <span className="text-text-primary font-medium capitalize">{data.accountType}</span>
          </div>
        </div>
      </div>

      {/* Consent Checkboxes */}
      <div className="space-y-4 mb-8">
        <h3 className="text-sm font-semibold text-text-primary">
          Disclosures & Consent
        </h3>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={data.creditCheckConsent}
            onChange={(e) => updateData({ creditCheckConsent: e.target.checked })}
            className="mt-1 w-4 h-4 rounded border-surface-dark text-primary focus:ring-primary"
          />
          <span className="text-sm text-text-secondary">
            I authorize {SITE_NAME} to obtain my credit report from one or more
            consumer reporting agencies and to verify the information I have
            provided for the purpose of evaluating my loan application. *
          </span>
        </label>
        {errors.creditCheckConsent && (
          <p className="text-error text-xs ml-7">{errors.creditCheckConsent}</p>
        )}

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={data.privacyConsent}
            onChange={(e) => updateData({ privacyConsent: e.target.checked })}
            className="mt-1 w-4 h-4 rounded border-surface-dark text-primary focus:ring-primary"
          />
          <span className="text-sm text-text-secondary">
            I have read and agree to the{" "}
            <Link href="/privacy-policy" className="text-primary hover:underline" target="_blank">
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link href="/terms-of-service" className="text-primary hover:underline" target="_blank">
              Terms of Service
            </Link>. *
          </span>
        </label>
        {errors.privacyConsent && (
          <p className="text-error text-xs ml-7">{errors.privacyConsent}</p>
        )}

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={data.tcpaConsent}
            onChange={(e) => updateData({ tcpaConsent: e.target.checked })}
            className="mt-1 w-4 h-4 rounded border-surface-dark text-primary focus:ring-primary"
          />
          <span className="text-sm text-text-secondary">
            <strong>TCPA Consent:</strong> By checking this box, I consent to
            receive calls, text messages, and emails from {SITE_NAME} and its
            partners regarding my loan application, including through the use
            of automated systems and prerecorded messages, at the phone number
            and email address I provided. I understand that my consent is not a
            condition of purchasing any product or service. Message and data
            rates may apply. I may opt out at any time. *
          </span>
        </label>
        {errors.tcpaConsent && (
          <p className="text-error text-xs ml-7">{errors.tcpaConsent}</p>
        )}
      </div>

      {/* Jornaya/TrustedForm placeholder */}
      <input type="hidden" id="leadid_token" name="universal_leadid" value="" />

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="text-text-secondary hover:text-text-primary font-medium px-6 py-3 transition-colors"
          disabled={isSubmitting}
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="bg-primary hover:bg-primary-dark text-white px-10 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              Submitting...
            </>
          ) : (
            "Submit Application"
          )}
        </button>
      </div>
    </div>
  );
}
