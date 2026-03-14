"use client";

import { useState, useEffect } from "react";
import type { ApplicationData } from "../ApplicationWizard";
import { bankingSchema, extractFieldErrors } from "@/lib/validation";
import { ACCOUNT_TYPES } from "@/lib/constants";
import { apiUrl } from "@/lib/api";

interface Props {
  data: ApplicationData;
  updateData: (updates: Partial<ApplicationData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function StepBanking({
  data,
  updateData,
  onNext,
  onBack,
}: Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [lookingUp, setLookingUp] = useState(false);
  const [lookupError, setLookupError] = useState("");
  const [showAccountNumber, setShowAccountNumber] = useState(false);

  // Auto-lookup bank name when routing number reaches 9 digits
  useEffect(() => {
    const value = data.routingNumber;
    const shouldLookup = /^\d{9}$/.test(value);

    if (shouldLookup) {
      setLookingUp(true);
      setLookupError("");
      fetch(apiUrl(`/api/routing-lookup?routing=${value}&type=routing`))
        .then((res) => res.json())
        .then((result) => {
          if (result.bankName) {
            updateData({ bankName: result.bankName });
          } else if (result.valid) {
            setLookupError(
              "Valid routing number. Please enter bank name manually.",
            );
          } else {
            setLookupError(
              result.error || "Could not find bank. Please enter manually.",
            );
          }
        })
        .catch(() => {
          setLookupError("Lookup failed. Please enter bank name manually.");
        })
        .finally(() => setLookingUp(false));
    }
  }, [data.routingNumber, updateData]);

  const handleRoutingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 9);
    updateData({ routingNumber: val });
  };

  const handleNext = () => {
    const result = bankingSchema.safeParse({
      routingNumber: data.routingNumber,
      accountNumber: data.accountNumber,
      accountType: data.accountType,
      bankName: data.bankName,
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
        Banking Information
      </h2>
      <p className="text-sm text-text-secondary mb-6">
        Enter your bank details for direct deposit of funds. All data is
        encrypted with AES-256 encryption.
      </p>

      <div className="space-y-5">
        <div>
          <label
            htmlFor="routingNumber"
            className="block text-sm font-medium text-text-primary mb-1.5"
          >
            Routing Number *
          </label>
          <input
            type="text"
            id="routingNumber"
            value={data.routingNumber}
            onChange={handleRoutingChange}
            className={`w-full px-4 py-3 border rounded-lg transition-colors ${
              errors.routingNumber
                ? "border-error"
                : "border-surface-dark focus:border-primary"
            }`}
            placeholder="Enter 9-digit routing number"
            maxLength={9}
            inputMode="numeric"
          />
          {errors.routingNumber && (
            <p className="text-error text-xs mt-1">{errors.routingNumber}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="bankName"
            className="block text-sm font-medium text-text-primary mb-1.5"
          >
            Bank Name *
          </label>
          <div className="relative">
            <input
              type="text"
              id="bankName"
              value={data.bankName}
              onChange={(e) => updateData({ bankName: e.target.value })}
              className={`w-full px-4 py-3 border rounded-lg transition-colors ${
                errors.bankName
                  ? "border-error"
                  : "border-surface-dark focus:border-primary"
              } ${lookingUp ? "pr-10" : ""}`}
              placeholder={
                lookingUp
                  ? "Looking up..."
                  : "Bank name (auto-filled from routing number)"
              }
              readOnly={lookingUp}
            />
            {lookingUp && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="animate-spin w-5 h-5 border-2 border-primary border-t-transparent rounded-full" />
              </div>
            )}
          </div>
          {data.bankName && !lookingUp && !lookupError && (
            <div className="flex items-center gap-1.5 mt-1.5">
              <svg
                className="w-3.5 h-3.5 text-success"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-xs text-success">Bank verified</span>
            </div>
          )}
          {lookupError && (
            <p className="text-warning text-xs mt-1">{lookupError}</p>
          )}
          {errors.bankName && (
            <p className="text-error text-xs mt-1">{errors.bankName}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="accountNumber"
            className="block text-sm font-medium text-text-primary mb-1.5"
          >
            Account Number *
          </label>
          <div className="relative">
            <input
              type={showAccountNumber ? "text" : "password"}
              id="accountNumber"
              value={data.accountNumber}
              onChange={(e) =>
                updateData({ accountNumber: e.target.value.replace(/\D/g, "") })
              }
              className={`w-full px-4 py-3 pr-16 border rounded-lg transition-colors ${
                errors.accountNumber
                  ? "border-error"
                  : "border-surface-dark focus:border-primary"
              }`}
              placeholder="Enter your account number"
              autoComplete="off"
            />
            <button
              type="button"
              onClick={() => setShowAccountNumber(!showAccountNumber)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-primary hover:text-primary-dark transition-colors"
            >
              {showAccountNumber ? "HIDE" : "SHOW"}
            </button>
          </div>
          {errors.accountNumber && (
            <p className="text-error text-xs mt-1">{errors.accountNumber}</p>
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
          <label className="block text-sm font-medium text-text-primary mb-3">
            Account Type *
          </label>
          <div className="grid grid-cols-2 gap-3">
            {ACCOUNT_TYPES.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() =>
                  updateData({
                    accountType: type.value as "checking" | "savings",
                  })
                }
                className={`py-3 rounded-lg text-sm font-semibold border-2 transition-all ${
                  data.accountType === type.value
                    ? "border-primary bg-primary text-white"
                    : "border-surface-dark bg-white text-text-secondary hover:border-primary/50"
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
          {errors.accountType && (
            <p className="text-error text-xs mt-1">{errors.accountType}</p>
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
