"use client";

import { useState } from "react";
import type { ApplicationData } from "../ApplicationWizard";
import { employmentSchema, extractFieldErrors } from "@/lib/validation";
import { EMPLOYMENT_STATUSES } from "@/lib/constants";

interface Props {
  data: ApplicationData;
  updateData: (updates: Partial<ApplicationData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function StepEmployment({
  data,
  updateData,
  onNext,
  onBack,
}: Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleNext = () => {
    const result = employmentSchema.safeParse({
      employmentStatus: data.employmentStatus,
      employerName: data.employerName,
      jobTitle: data.jobTitle,
      monthlyIncome: data.monthlyIncome,
      yearsEmployed: data.yearsEmployed,
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
        Employment & Income
      </h2>
      <p className="text-sm text-text-secondary mb-6">
        Tell us about your current employment situation.
      </p>

      <div className="space-y-5">
        <div>
          <label
            htmlFor="employmentStatus"
            className="block text-sm font-medium text-text-primary mb-1.5"
          >
            Employment Status *
          </label>
          <select
            id="employmentStatus"
            value={data.employmentStatus}
            onChange={(e) => updateData({ employmentStatus: e.target.value })}
            className={`w-full px-4 py-3 border rounded-lg transition-colors ${
              errors.employmentStatus
                ? "border-error"
                : "border-surface-dark focus:border-primary"
            }`}
          >
            <option value="">Select status</option>
            {EMPLOYMENT_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          {errors.employmentStatus && (
            <p className="text-error text-xs mt-1">{errors.employmentStatus}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="employerName"
            className="block text-sm font-medium text-text-primary mb-1.5"
          >
            Employer Name *
          </label>
          <input
            type="text"
            id="employerName"
            value={data.employerName}
            onChange={(e) => updateData({ employerName: e.target.value })}
            className={`w-full px-4 py-3 border rounded-lg transition-colors ${
              errors.employerName
                ? "border-error"
                : "border-surface-dark focus:border-primary"
            }`}
            placeholder="Acme Corporation"
          />
          {errors.employerName && (
            <p className="text-error text-xs mt-1">{errors.employerName}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="jobTitle"
            className="block text-sm font-medium text-text-primary mb-1.5"
          >
            Job Title *
          </label>
          <input
            type="text"
            id="jobTitle"
            value={data.jobTitle}
            onChange={(e) => updateData({ jobTitle: e.target.value })}
            className={`w-full px-4 py-3 border rounded-lg transition-colors ${
              errors.jobTitle
                ? "border-error"
                : "border-surface-dark focus:border-primary"
            }`}
            placeholder="Software Engineer"
          />
          {errors.jobTitle && (
            <p className="text-error text-xs mt-1">{errors.jobTitle}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label
              htmlFor="monthlyIncome"
              className="block text-sm font-medium text-text-primary mb-1.5"
            >
              Monthly Income (USD) *
            </label>
            <input
              type="text"
              id="monthlyIncome"
              value={data.monthlyIncome || ""}
              onChange={(e) =>
                updateData({ monthlyIncome: Number(e.target.value) })
              }
              className={`w-full px-4 py-3 border rounded-lg transition-colors ${
                errors.monthlyIncome
                  ? "border-error"
                  : "border-surface-dark focus:border-primary"
              }`}
              placeholder="5000"
              min={0}
            />
            {errors.monthlyIncome && (
              <p className="text-error text-xs mt-1">{errors.monthlyIncome}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="yearsEmployed"
              className="block text-sm font-medium text-text-primary mb-1.5"
            >
              Years at Current Job *
            </label>
            <input
              type="text"
              id="yearsEmployed"
              value={data.yearsEmployed || ""}
              onChange={(e) =>
                updateData({ yearsEmployed: Number(e.target.value) })
              }
              className={`w-full px-4 py-3 border rounded-lg transition-colors ${
                errors.yearsEmployed
                  ? "border-error"
                  : "border-surface-dark focus:border-primary"
              }`}
              placeholder="3"
              min={0}
              max={50}
            />
            {errors.yearsEmployed && (
              <p className="text-error text-xs mt-1">{errors.yearsEmployed}</p>
            )}
          </div>
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
