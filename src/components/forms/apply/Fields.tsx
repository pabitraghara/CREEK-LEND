"use client";

/**
 * Shared form primitives.
 *
 * Every input validates on blur and keeps whatever the applicant typed when it
 * reports a problem — a field that clears itself on error makes the applicant
 * retype work they already did.
 */

import type { ReactNode } from "react";
import type { Option } from "@/lib/application/options";

const INPUT_BASE =
  "w-full px-4 py-3 border rounded-lg transition-colors bg-white text-text-primary";

function inputClass(hasError: boolean): string {
  return `${INPUT_BASE} ${
    hasError ? "border-error" : "border-surface-dark focus:border-primary"
  }`;
}

interface FieldShellProps {
  id: string;
  label: string;
  error?: string;
  hint?: ReactNode;
  required?: boolean;
  children: ReactNode;
}

export function FieldShell({ id, label, error, hint, required, children }: FieldShellProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-text-primary mb-1.5">
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      {children}
      {hint && !error && <p className="text-text-secondary text-xs mt-1">{hint}</p>}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-error text-xs mt-1">
          {error}
        </p>
      )}
    </div>
  );
}

interface TextFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  hint?: ReactNode;
  required?: boolean;
  placeholder?: string;
  type?: string;
  inputMode?: "text" | "numeric" | "tel" | "email" | "decimal";
  autoComplete?: string;
  maxLength?: number;
  disabled?: boolean;
  readOnly?: boolean;
  /** Disables paste — used on the confirm-email, SSN and account fields. */
  blockPaste?: boolean;
}

export function TextField({
  id, label, value, onChange, onBlur, error, hint, required,
  placeholder, type = "text", inputMode, autoComplete, maxLength,
  disabled, readOnly, blockPaste,
}: TextFieldProps) {
  return (
    <FieldShell id={id} label={label} error={error} hint={hint} required={required}>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        onPaste={blockPaste ? (e) => e.preventDefault() : undefined}
        placeholder={placeholder}
        inputMode={inputMode}
        autoComplete={autoComplete}
        maxLength={maxLength}
        disabled={disabled}
        readOnly={readOnly}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${inputClass(Boolean(error))} ${
          readOnly || disabled ? "bg-surface text-text-secondary cursor-not-allowed" : ""
        }`}
      />
    </FieldShell>
  );
}

interface CurrencyFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  hint?: ReactNode;
  required?: boolean;
  placeholder?: string;
}

/** Whole dollars. The thousands separator lands on blur, not on every keystroke. */
export function CurrencyField({
  id, label, value, onChange, onBlur, error, hint, required, placeholder,
}: CurrencyFieldProps) {
  return (
    <FieldShell id={id} label={label} error={error} hint={hint} required={required}>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none">
          $
        </span>
        <input
          id={id}
          name={id}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/[^0-9,]/g, ""))}
          onBlur={onBlur}
          placeholder={placeholder}
          inputMode="numeric"
          autoComplete="off"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`${inputClass(Boolean(error))} pl-8`}
        />
      </div>
    </FieldShell>
  );
}

interface SelectFieldProps {
  id: string;
  label: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  hint?: ReactNode;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
}

export function SelectField({
  id, label, value, options, onChange, onBlur, error, hint, required,
  placeholder = "Select…", disabled,
}: SelectFieldProps) {
  return (
    <FieldShell id={id} label={label} error={error} hint={hint} required={required}>
      <select
        id={id}
        name={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={inputClass(Boolean(error))}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value || "none"} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

interface RadioFieldProps {
  id: string;
  label: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  error?: string;
  hint?: ReactNode;
  required?: boolean;
}

export function RadioField({
  id, label, value, options, onChange, error, hint, required,
}: RadioFieldProps) {
  return (
    <fieldset>
      <legend className="block text-sm font-medium text-text-primary mb-1.5">
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </legend>
      <div className="flex flex-wrap gap-3">
        {options.map((option) => {
          const selected = value === option.value;
          return (
            <label
              key={option.value}
              className={`flex items-center gap-2 px-4 py-3 border rounded-lg cursor-pointer transition-colors ${
                selected
                  ? "border-primary bg-primary/5"
                  : error
                    ? "border-error"
                    : "border-surface-dark hover:border-primary/50"
              }`}
            >
              <input
                type="radio"
                name={id}
                value={option.value}
                checked={selected}
                onChange={() => onChange(option.value)}
                className="accent-primary"
              />
              <span className="text-sm text-text-primary">{option.label}</span>
            </label>
          );
        })}
      </div>
      {hint && !error && <p className="text-text-secondary text-xs mt-1">{hint}</p>}
      {error && <p role="alert" className="text-error text-xs mt-1">{error}</p>}
    </fieldset>
  );
}

export function SectionHeading({ title, description }: { title: string; description?: string }) {
  return (
    <div className="pt-2">
      <h3 className="text-base font-semibold text-text-primary">{title}</h3>
      {description && <p className="text-sm text-text-secondary mt-0.5">{description}</p>}
    </div>
  );
}

/** Encryption / licensing reassurance, placed beside the sensitive sections. */
export function TrustMarkers({ variant }: { variant: "identity" | "bank" }) {
  return (
    <div className="rounded-lg border border-surface-dark bg-surface p-4 text-xs text-text-secondary space-y-1.5">
      <p className="flex items-start gap-2">
        <span aria-hidden="true">🔒</span>
        <span>
          {variant === "identity"
            ? "Your Social Security Number is encrypted with AES-256 before it is stored, and is never shown in full to our staff."
            : "Your account details are encrypted with AES-256 before they are stored, and are masked everywhere in our systems."}
        </span>
      </p>
      <p className="flex items-start gap-2">
        <span aria-hidden="true">🏛️</span>
        <span>Creek Lend is a licensed direct lender. We never sell your banking information.</span>
      </p>
      <p className="flex items-start gap-2">
        <span aria-hidden="true">🛡️</span>
        <span>This page is secured with TLS. Look for the padlock in your browser&apos;s address bar.</span>
      </p>
    </div>
  );
}
