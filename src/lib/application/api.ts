/** Typed client for the three-step application endpoints. */

import { apiUrl } from "@/lib/api";
import type { ApplyConfig, StepResponse } from "./types";

async function postJson(path: string, body: unknown): Promise<StepResponse> {
  try {
    const response = await fetch(apiUrl(path), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = (await response.json()) as StepResponse;

    // A 409 or 403 carries a meaningful body, so the payload is returned
    // rather than thrown: the form needs the code and the field errors.
    return data;
  } catch {
    return { error: "We couldn't reach our servers. Please check your connection and try again." };
  }
}

export function submitStep1(body: unknown): Promise<StepResponse> {
  return postJson("/api/apply/step1", body);
}

export function submitStep2(body: unknown): Promise<StepResponse> {
  return postJson("/api/apply/step2", body);
}

export function submitStep3(body: unknown): Promise<StepResponse> {
  return postJson("/api/apply/step3", body);
}

export async function fetchConfig(params?: {
  state?: string;
  amount?: number;
  income?: number;
}): Promise<ApplyConfig | null> {
  const query = new URLSearchParams();
  if (params?.state) query.set("state", params.state);
  if (params?.amount) query.set("amount", String(params.amount));
  if (params?.income) query.set("income", String(params.income));

  try {
    const response = await fetch(apiUrl(`/api/apply/config?${query.toString()}`));
    if (!response.ok) return null;
    return (await response.json()) as ApplyConfig;
  } catch {
    return null;
  }
}

export interface Quote {
  amount: number;
  term: number;
  apr: number;
  estimatedInstallment: number;
  totalRepayment: number;
}

export async function fetchQuote(amount: number, term: number): Promise<Quote | null> {
  try {
    const response = await fetch(apiUrl(`/api/apply/quote?amount=${amount}&term=${term}`));
    if (!response.ok) return null;
    return (await response.json()) as Quote;
  } catch {
    return null;
  }
}

export interface RoutingLookup {
  bankName: string;
  city: string;
  state: string;
  valid: boolean;
  error?: string;
}

/** Field 44 — the bank name is looked up, never typed, in the common case. */
export async function lookupRouting(routingNumber: string): Promise<RoutingLookup | null> {
  try {
    const response = await fetch(apiUrl(`/api/routing-lookup?routing=${routingNumber}`));
    if (!response.ok) return null;
    return (await response.json()) as RoutingLookup;
  } catch {
    return null;
  }
}

export interface ResumeResponse {
  success?: boolean;
  error?: string;
  application?: Record<string, unknown> & {
    id: string;
    current_step: number;
    highest_step_reached: number;
    status: string;
  };
}

/**
 * Rehydrates a saved application from the link emailed after Step 1.
 *
 * Sensitive fields are deliberately absent from the response — a resumed
 * session re-collects the SSN and account number rather than having them sent
 * back to a browser.
 */
export async function resumeApplication(
  applicationId: string,
  token: string,
): Promise<ResumeResponse> {
  try {
    const response = await fetch(
      apiUrl(`/api/apply/resume?app=${encodeURIComponent(applicationId)}&token=${encodeURIComponent(token)}`),
    );
    return (await response.json()) as ResumeResponse;
  } catch {
    return { error: "We couldn't load your application. Please try the link again." };
  }
}
