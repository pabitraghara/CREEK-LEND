"use client";

import { useState } from "react";
import type { ApplicationData } from "../ApplicationWizard";
import { addressSchema, extractFieldErrors } from "@/lib/validation";
import { US_STATES, CA_PROVINCES, IN_STATES } from "@/lib/constants";

interface Props {
  data: ApplicationData;
  updateData: (updates: Partial<ApplicationData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function StepAddress({ data, updateData, onNext, onBack }: Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const getStateOptions = () => {
    switch (data.country) {
      case "CA": return CA_PROVINCES;
      case "IN": return IN_STATES;
      default: return US_STATES;
    }
  };

  const handleNext = () => {
    const result = addressSchema.safeParse({
      streetAddress: data.streetAddress,
      city: data.city,
      state: data.state,
      zipCode: data.zipCode,
      country: data.country,
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
        Residential Address
      </h2>
      <p className="text-sm text-text-secondary mb-6">
        Enter your current residential address.
      </p>

      <div className="space-y-5">
        <div>
          <label htmlFor="country" className="block text-sm font-medium text-text-primary mb-1.5">
            Country *
          </label>
          <select
            id="country"
            value={data.country}
            onChange={(e) =>
              updateData({
                country: e.target.value as "US" | "CA" | "IN",
                state: "",
              })
            }
            className="w-full px-4 py-3 border border-surface-dark rounded-lg focus:border-primary transition-colors"
          >
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="IN">India</option>
          </select>
        </div>

        <div>
          <label htmlFor="streetAddress" className="block text-sm font-medium text-text-primary mb-1.5">
            Street Address *
          </label>
          <input
            type="text"
            id="streetAddress"
            value={data.streetAddress}
            onChange={(e) => updateData({ streetAddress: e.target.value })}
            className={`w-full px-4 py-3 border rounded-lg transition-colors ${
              errors.streetAddress ? "border-error" : "border-surface-dark focus:border-primary"
            }`}
            placeholder="123 Main Street"
          />
          {errors.streetAddress && (
            <p className="text-error text-xs mt-1">{errors.streetAddress}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-text-primary mb-1.5">
              City *
            </label>
            <input
              type="text"
              id="city"
              value={data.city}
              onChange={(e) => updateData({ city: e.target.value })}
              className={`w-full px-4 py-3 border rounded-lg transition-colors ${
                errors.city ? "border-error" : "border-surface-dark focus:border-primary"
              }`}
              placeholder="New York"
            />
            {errors.city && (
              <p className="text-error text-xs mt-1">{errors.city}</p>
            )}
          </div>
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-text-primary mb-1.5">
              {data.country === "CA" ? "Province *" : "State *"}
            </label>
            <select
              id="state"
              value={data.state}
              onChange={(e) => updateData({ state: e.target.value })}
              className={`w-full px-4 py-3 border rounded-lg transition-colors ${
                errors.state ? "border-error" : "border-surface-dark focus:border-primary"
              }`}
            >
              <option value="">Select {data.country === "CA" ? "province" : "state"}</option>
              {getStateOptions().map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            {errors.state && (
              <p className="text-error text-xs mt-1">{errors.state}</p>
            )}
          </div>
        </div>

        <div className="sm:w-1/2">
          <label htmlFor="zipCode" className="block text-sm font-medium text-text-primary mb-1.5">
            {data.country === "CA" ? "Postal Code *" : data.country === "IN" ? "PIN Code *" : "ZIP Code *"}
          </label>
          <input
            type="text"
            id="zipCode"
            value={data.zipCode}
            onChange={(e) => updateData({ zipCode: e.target.value })}
            className={`w-full px-4 py-3 border rounded-lg transition-colors ${
              errors.zipCode ? "border-error" : "border-surface-dark focus:border-primary"
            }`}
            placeholder={data.country === "CA" ? "A1A 1A1" : data.country === "IN" ? "110001" : "10001"}
          />
          {errors.zipCode && (
            <p className="text-error text-xs mt-1">{errors.zipCode}</p>
          )}
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <button type="button" onClick={onBack} className="text-text-secondary hover:text-text-primary font-medium px-6 py-3 transition-colors">
          Back
        </button>
        <button type="button" onClick={handleNext} className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg font-semibold transition-colors">
          Continue
        </button>
      </div>
    </div>
  );
}
