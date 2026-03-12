"use client";

import { useState } from "react";
import type { ApplicationData } from "../ApplicationWizard";
import { personalInfoSchema, extractFieldErrors } from "@/lib/validation";

interface Props {
  data: ApplicationData;
  updateData: (updates: Partial<ApplicationData>) => void;
  onNext: () => void;
}

export default function StepPersonalInfo({ data, updateData, onNext }: Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleNext = () => {
    const result = personalInfoSchema.safeParse({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      dateOfBirth: data.dateOfBirth,
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
        Personal Information
      </h2>
      <p className="text-sm text-text-secondary mb-6">
        Please provide your legal name as it appears on your ID.
      </p>

      <div className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-text-primary mb-1.5">
              First Name *
            </label>
            <input
              type="text"
              id="firstName"
              value={data.firstName}
              onChange={(e) => updateData({ firstName: e.target.value })}
              className={`w-full px-4 py-3 border rounded-lg transition-colors ${
                errors.firstName ? "border-error" : "border-surface-dark focus:border-primary"
              }`}
              placeholder="John"
            />
            {errors.firstName && (
              <p className="text-error text-xs mt-1">{errors.firstName}</p>
            )}
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-text-primary mb-1.5">
              Last Name *
            </label>
            <input
              type="text"
              id="lastName"
              value={data.lastName}
              onChange={(e) => updateData({ lastName: e.target.value })}
              className={`w-full px-4 py-3 border rounded-lg transition-colors ${
                errors.lastName ? "border-error" : "border-surface-dark focus:border-primary"
              }`}
              placeholder="Doe"
            />
            {errors.lastName && (
              <p className="text-error text-xs mt-1">{errors.lastName}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-1.5">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            value={data.email}
            onChange={(e) => updateData({ email: e.target.value })}
            className={`w-full px-4 py-3 border rounded-lg transition-colors ${
              errors.email ? "border-error" : "border-surface-dark focus:border-primary"
            }`}
            placeholder="john.doe@email.com"
          />
          {errors.email && (
            <p className="text-error text-xs mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-text-primary mb-1.5">
            Phone Number *
          </label>
          <input
            type="tel"
            id="phone"
            value={data.phone}
            onChange={(e) => updateData({ phone: e.target.value })}
            className={`w-full px-4 py-3 border rounded-lg transition-colors ${
              errors.phone ? "border-error" : "border-surface-dark focus:border-primary"
            }`}
            placeholder="(555) 123-4567"
          />
          {errors.phone && (
            <p className="text-error text-xs mt-1">{errors.phone}</p>
          )}
        </div>

        <div>
          <label htmlFor="dateOfBirth" className="block text-sm font-medium text-text-primary mb-1.5">
            Date of Birth *
          </label>
          <input
            type="date"
            id="dateOfBirth"
            value={data.dateOfBirth}
            onChange={(e) => updateData({ dateOfBirth: e.target.value })}
            className={`w-full px-4 py-3 border rounded-lg transition-colors ${
              errors.dateOfBirth ? "border-error" : "border-surface-dark focus:border-primary"
            }`}
          />
          {errors.dateOfBirth && (
            <p className="text-error text-xs mt-1">{errors.dateOfBirth}</p>
          )}
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          type="button"
          onClick={handleNext}
          className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg font-semibold transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
