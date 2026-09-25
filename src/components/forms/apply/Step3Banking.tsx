"use client";

/**
 * Step 3 — Bank and funding (fields 43-49).
 *
 * The last step: Submit here sends the whole application. Pre-qualification
 * runs on the server then, and a declined applicant never has bank details in
 * our database at all.
 *
 * The applicant types both the routing number and the bank name. The routing
 * number is checked against the ABA checksum to catch typos; the bank name is
 * stored as entered.
 */

import {
  ACCOUNT_AGES,
  ACCOUNT_STATUSES,
  ACCOUNT_TYPES,
} from "@/lib/application/options";
import type { ConsentDefinition, ConsentState, Step3Data } from "@/lib/application/types";
import type { Errors } from "@/lib/application/validate";
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
  submitting: boolean;
  formError?: string;
  missingConsents?: string[];
  onChange: (updates: Partial<Step3Data>) => void;
  onBlurField: (field: keyof Step3Data) => void;
  onConsentChange: (type: string, checked: boolean) => void;
  onBack: () => void;
  /** Sends all three steps. The only action on the form that saves anything. */
  onSubmit: () => void;
}

export default function Step3Banking({
  data, errors, consents, consentState, submitting,
  formError, missingConsents, onChange, onBlurField, onConsentChange, onBack, onSubmit,
}: Props) {
  return (
    <div className="space-y-8">

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
            onBlur={() => onBlurField("routingNumber")}
            error={errors.routingNumber}
            autoComplete="off" placeholder="021000021" maxLength={9}
            hint="The 9-digit number on the bottom-left of your cheque."
          />
          <TextField
            id="bankName" label="Bank Name" required
            value={data.bankName}
            onChange={(value) => onChange({ bankName: value })}
            onBlur={() => onBlurField("bankName")}
            error={errors.bankName}
            autoComplete="off" maxLength={100}
            placeholder="Your bank's name"
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

      <div className="flex flex-col-reverse sm:flex-row gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={submitting}
          className="sm:w-40 border border-surface-dark hover:bg-surface disabled:opacity-60 disabled:cursor-not-allowed text-text-primary font-semibold py-4 rounded-lg transition-colors"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={submitting}
          className="flex-1 bg-primary hover:bg-primary-dark disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-lg transition-colors"
        >
          {submitting ? "Submitting…" : "Submit Application"}
        </button>
      </div>
    </div>
  );
}
