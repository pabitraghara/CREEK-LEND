"use client";

/**
 * Step 2 — Identity verification (fields 33-37).
 *
 * Nothing here is sent until the final Submit. Pre-qualification runs then,
 * and an applicant who fails it never has their SSN stored.
 *
 * Autofill is switched off on every field here, and paste is blocked on the
 * confirm inputs so a typo is caught rather than duplicated.
 */

import { US_STATES } from "@/lib/constants";
import type { ConsentDefinition, ConsentState, Step2Data } from "@/lib/application/types";
import { type Errors, formatSsnInput } from "@/lib/application/validate";
import { SectionHeading, SelectField, TextField, TrustMarkers } from "./Fields";
import ConsentBlock from "./ConsentBlock";

interface Props {
  data: Step2Data;
  errors: Errors;
  consents: ConsentDefinition[];
  consentState: ConsentState;
  formError?: string;
  missingConsents?: string[];
  onChange: (updates: Partial<Step2Data>) => void;
  onBlurField: (field: keyof Step2Data) => void;
  onConsentChange: (type: string, checked: boolean) => void;
  onBack: () => void;
  /** Validates this step and moves on. Nothing is sent to the server yet. */
  onNext: () => void;
}

export default function Step2Identity({
  data, errors, consents, consentState,
  formError, missingConsents, onChange, onBlurField, onConsentChange, onBack, onNext,
}: Props) {
  return (
    <div className="space-y-8">

      <section className="space-y-5">
        <SectionHeading
          title="Verify your identity"
          description="We're required to confirm who you are before we can make you an offer."
        />

        <TrustMarkers variant="identity" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <TextField
            id="ssn" label="Social Security Number" required
            inputMode="numeric"
            value={data.ssn}
            onChange={(value) => onChange({ ssn: formatSsnInput(value) })}
            onBlur={() => onBlurField("ssn")}
            error={errors.ssn}
            autoComplete="off" placeholder="123-45-6789" maxLength={11}
          />
          <TextField
            id="confirmSsn" label="Confirm SSN" required
            inputMode="numeric"
            value={data.confirmSsn}
            onChange={(value) => onChange({ confirmSsn: formatSsnInput(value) })}
            onBlur={() => onBlurField("confirmSsn")}
            error={errors.confirmSsn}
            autoComplete="off" placeholder="123-45-6789" maxLength={11}
            blockPaste
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <TextField
            id="driverLicenseNumber" label="Driver's License Number" required
            value={data.driverLicenseNumber}
            onChange={(value) => onChange({ driverLicenseNumber: value.toUpperCase() })}
            onBlur={() => onBlurField("driverLicenseNumber")}
            error={errors.driverLicenseNumber}
            autoComplete="off" maxLength={20}
          />
          <SelectField
            id="driverLicenseState" label="Issuing State" required
            value={data.driverLicenseState}
            options={US_STATES}
            onChange={(value) => onChange({ driverLicenseState: value })}
            onBlur={() => onBlurField("driverLicenseState")}
            error={errors.driverLicenseState}
          />
        </div>

        <TextField
          id="dlExpirationDate" label="License Expiration Date" required
          type="date"
          value={data.dlExpirationDate}
          onChange={(value) => onChange({ dlExpirationDate: value })}
          onBlur={() => onBlurField("dlExpirationDate")}
          error={errors.dlExpirationDate}
          autoComplete="off"
        />
      </section>

      <section className="space-y-4">
        <SectionHeading title="Credit check authorization" />
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
          className="sm:w-40 border border-surface-dark hover:bg-surface disabled:opacity-60 disabled:cursor-not-allowed text-text-primary font-semibold py-4 rounded-lg transition-colors"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          className="flex-1 bg-primary hover:bg-primary-dark disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-lg transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}
