"use client";

/**
 * Step 3 — Bank and funding (fields 43-49).
 *
 * Reached only after underwriting approval, so a declined applicant never has
 * bank details in our database at all.
 *
 * The bank name is filled in from the routing number rather than typed. The
 * applicant only enters it themselves in the rare case where a valid routing
 * number is missing from the participant table.
 */

import { useState } from "react";

import {
  ACCOUNT_AGES,
  ACCOUNT_STATUSES,
  ACCOUNT_TYPES,
} from "@/lib/application/options";
import type { ConsentDefinition, ConsentState, Step3Data } from "@/lib/application/types";
import { type Errors, checkAbaChecksum } from "@/lib/application/validate";
import { lookupRouting } from "@/lib/application/api";
import {
  RadioField,
  SectionHeading,
  SelectField,
  TextField,
  TrustMarkers,
} from "./Fields";
import ConsentBlock from "./ConsentBlock";

interface Props {
  data: Step3Data;
  errors: Errors;
  consents: ConsentDefinition[];
  consentState: ConsentState;
  applicationId: string;
  submitting: boolean;
  formError?: string;
  missingConsents?: string[];
  onChange: (updates: Partial<Step3Data>) => void;
  onBlurField: (field: keyof Step3Data) => void;
  onConsentChange: (type: string, checked: boolean) => void;
  onSubmit: () => void;
}

export default function Step3Banking({
  data, errors, consents, consentState, applicationId, submitting,
  formError, missingConsents, onChange, onBlurField, onConsentChange, onSubmit,
}: Props) {
  const [lookingUp, setLookingUp] = useState(false);
  const [bankNameEditable, setBankNameEditable] = useState(false);
  const [lookupNote, setLookupNote] = useState<string | null>(null);

  async function handleRoutingBlur() {
    onBlurField("routingNumber");

    const digits = data.routingNumber.replace(/\D/g, "");
    if (checkAbaChecksum(digits) !== null) {
      onChange({ bankName: "" });
      setBankNameEditable(false);
      setLookupNote(null);
      return;
    }

    setLookingUp(true);
    const result = await lookupRouting(digits);
    setLookingUp(false);

    if (result?.valid && result.bankName) {
      onChange({ bankName: result.bankName });
      setBankNameEditable(false);
      setLookupNote(null);
      return;
    }

    // Valid checksum but not in our participant table — the applicant supplies
    // the name. This is not a rejection.
    onChange({ bankName: "" });
    setBankNameEditable(true);
    setLookupNote("We couldn't match that routing number to a bank. Please enter your bank's name.");
  }

  return (
    <div className="space-y-8">
      <div className="rounded-lg bg-success/10 border border-success/30 px-4 py-3">
        <p className="text-sm font-semibold text-text-primary">Your loan is approved.</p>
        <p className="text-xs text-text-secondary mt-0.5">
          Application ID <strong>{applicationId}</strong>. Tell us where to send your funds.
        </p>
      </div>

      <section className="space-y-5">
        <SectionHeading
          title="Where should we deposit your funds?"
          description="Use a checking or savings account in your own name."
        />

        <TrustMarkers variant="bank" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <TextField
            id="routingNumber" label="Routing Number" required
            inputMode="numeric"
            value={data.routingNumber}
            onChange={(value) => onChange({ routingNumber: value.replace(/\D/g, "").slice(0, 9) })}
            onBlur={handleRoutingBlur}
            error={errors.routingNumber}
            autoComplete="off" placeholder="021000021" maxLength={9}
            hint={lookingUp ? "Looking up your bank…" : "The 9-digit number on the bottom-left of your cheque."}
          />
          <TextField
            id="bankName" label="Bank Name" required
            value={data.bankName}
            onChange={(value) => onChange({ bankName: value })}
            onBlur={() => onBlurField("bankName")}
            error={errors.bankName}
            readOnly={!bankNameEditable}
            autoComplete="off"
            placeholder={bankNameEditable ? "Your bank's name" : "Filled in from your routing number"}
            hint={lookupNote ?? undefined}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <TextField
            id="accountNumber" label="Account Number" required
            inputMode="numeric"
            value={data.accountNumber}
            onChange={(value) => onChange({ accountNumber: value.replace(/\D/g, "").slice(0, 17) })}
            onBlur={() => onBlurField("accountNumber")}
            error={errors.accountNumber}
            autoComplete="off" maxLength={17}
          />
          <TextField
            id="confirmAccountNumber" label="Confirm Account Number" required
            inputMode="numeric"
            value={data.confirmAccountNumber}
            onChange={(value) =>
              onChange({ confirmAccountNumber: value.replace(/\D/g, "").slice(0, 17) })
            }
            onBlur={() => onBlurField("confirmAccountNumber")}
            error={errors.confirmAccountNumber}
            autoComplete="off" maxLength={17} blockPaste
          />
        </div>

        <RadioField
          id="accountType" label="Account type" required
          value={data.accountType}
          options={ACCOUNT_TYPES}
          onChange={(value) => onChange({ accountType: value })}
          error={errors.accountType}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <SelectField
            id="accountStatus" label="Current account standing" required
            value={data.accountStatus}
            options={ACCOUNT_STATUSES}
            onChange={(value) => onChange({ accountStatus: value })}
            onBlur={() => onBlurField("accountStatus")}
            error={errors.accountStatus}
          />
          <SelectField
            id="accountAge" label="How long have you had this account?" required
            value={data.accountAge}
            options={ACCOUNT_AGES}
            onChange={(value) => onChange({ accountAge: value })}
            onBlur={() => onBlurField("accountAge")}
            error={errors.accountAge}
          />
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeading title="Payment authorization" />
        <ConsentBlock
          consents={consents}
          state={consentState}
          onChange={onConsentChange}
          missing={missingConsents}
        />
      </section>

      {formError && (
        <p role="alert" className="text-error text-sm bg-error/5 border border-error/20 rounded-lg px-4 py-3">
          {formError}
        </p>
      )}

      <button
        type="button"
        onClick={onSubmit}
        disabled={submitting}
        className="w-full bg-primary hover:bg-primary-dark disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-lg transition-colors"
      >
        {submitting ? "Submitting…" : "Complete My Application"}
      </button>
    </div>
  );
}
