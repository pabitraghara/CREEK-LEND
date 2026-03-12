"use client";

import { useState } from "react";
import type { ApplicationData } from "../ApplicationWizard";
import { identificationSchema, extractFieldErrors } from "@/lib/validation";
import { US_STATES } from "@/lib/constants";

interface Props {
  data: ApplicationData;
  updateData: (updates: Partial<ApplicationData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function StepIdentification({
  data,
  updateData,
  onNext,
  onBack,
}: Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleNext = () => {
    const result = identificationSchema.safeParse({
      ssn: data.ssn,
      driverLicenseNumber: data.driverLicenseNumber,
      driverLicenseState: data.driverLicenseState,
    });

    if (!result.success) {
      setErrors(extractFieldErrors(result.error));
      return;
    }

    setErrors({});
    onNext();
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-text-primary mb-1">
        Identification
      </h2>
      <p className="text-sm text-text-secondary mb-6">
        This information is required for identity verification and is encrypted
        with AES-256 encryption.
      </p>

      <div className="space-y-5">
        <div>
          <label
            htmlFor="ssn"
            className="block text-sm font-medium text-text-primary mb-1.5"
          >
            Social Security Number (SSN) *
          </label>
          <input
            type="password"
            id="ssn"
            value={data.ssn}
            onChange={(e) => updateData({ ssn: e.target.value })}
            className={`w-full px-4 py-3 border rounded-lg transition-colors ${
              errors.ssn
                ? "border-error"
                : "border-surface-dark focus:border-primary"
            }`}
            placeholder="XXX-XX-XXXX"
            autoComplete="off"
          />
          {errors.ssn && (
            <p className="text-error text-xs mt-1">{errors.ssn}</p>
          )}
          <div className="flex items-center gap-1.5 mt-1.5">
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
            <span className="text-xs text-text-secondary">
              Encrypted and secure
            </span>
          </div>
        </div>

        <div>
          <label
            htmlFor="driverLicenseNumber"
            className="block text-sm font-medium text-text-primary mb-1.5"
          >
            Driver&rsquo;s License Number *
          </label>
          <input
            type="text"
            id="driverLicenseNumber"
            value={data.driverLicenseNumber}
            onChange={(e) =>
              updateData({ driverLicenseNumber: e.target.value })
            }
            className={`w-full px-4 py-3 border rounded-lg transition-colors ${
              errors.driverLicenseNumber
                ? "border-error"
                : "border-surface-dark focus:border-primary"
            }`}
            placeholder="Enter your DL number"
          />
          {errors.driverLicenseNumber && (
            <p className="text-error text-xs mt-1">
              {errors.driverLicenseNumber}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="driverLicenseState"
            className="block text-sm font-medium text-text-primary mb-1.5"
          >
            DL Issuing State *
          </label>
          <select
            id="driverLicenseState"
            value={data.driverLicenseState}
            onChange={(e) => updateData({ driverLicenseState: e.target.value })}
            className={`w-full px-4 py-3 border rounded-lg transition-colors ${
              errors.driverLicenseState
                ? "border-error"
                : "border-surface-dark focus:border-primary"
            }`}
          >
            <option value="">Select state</option>
            {US_STATES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          {errors.driverLicenseState && (
            <p className="text-error text-xs mt-1">
              {errors.driverLicenseState}
            </p>
          )}
        </div>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-end gap-3 mb-2">
          <span className="flex items-center gap-1 text-xs text-text-secondary">
            <svg className="w-3.5 h-3.5 text-success" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
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
