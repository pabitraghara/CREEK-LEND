"use client";

/**
 * Consent checkboxes.
 *
 * Each consent is its own unchecked box. There is no "agree to everything"
 * control and nothing here starts ticked — a pre-ticked box is not consent,
 * and for TCPA in particular it is the difference between evidence that holds
 * up and evidence that doesn't.
 *
 * The text shown is the text the server stores against the application, so
 * the bodies are rendered from the server's own catalogue rather than a copy
 * kept in the frontend.
 */

import { useState } from "react";
import type { ConsentDefinition, ConsentState } from "@/lib/application/types";

interface Props {
  consents: ConsentDefinition[];
  state: ConsentState;
  onChange: (type: string, checked: boolean) => void;
  error?: string;
  missing?: string[];
}

export default function ConsentBlock({ consents, state, onChange, error, missing }: Props) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  if (consents.length === 0) return null;

  return (
    <div className="space-y-3">
      {error && (
        <p role="alert" className="text-error text-sm bg-error/5 border border-error/20 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {consents.map((consent) => {
        const isOpen = expanded[consent.type] ?? false;
        const isMissing = missing?.includes(consent.type) ?? false;

        return (
          <div
            key={consent.type}
            className={`rounded-lg border p-3 ${
              isMissing ? "border-error bg-error/5" : "border-surface-dark"
            }`}
          >
            <label className="flex gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={state[consent.type] ?? false}
                onChange={(e) => onChange(consent.type, e.target.checked)}
                className="mt-0.5 h-4 w-4 accent-primary shrink-0"
                aria-describedby={`${consent.type}-body`}
              />
              <span className="text-sm text-text-primary">
                {consent.label}
                {consent.required && <span aria-hidden="true"> *</span>}
              </span>
            </label>

            <div id={`${consent.type}-body`} className="mt-2 pl-7">
              <p
                className={`text-xs text-text-secondary leading-relaxed ${
                  isOpen ? "" : "line-clamp-3"
                }`}
              >
                {consent.body}
              </p>
              <button
                type="button"
                onClick={() =>
                  setExpanded((prev) => ({ ...prev, [consent.type]: !isOpen }))
                }
                className="text-xs text-primary underline mt-1"
              >
                {isOpen ? "Show less" : "Read full disclosure"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
