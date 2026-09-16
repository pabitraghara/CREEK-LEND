/**
 * Hidden/system fields captured silently on every step submission.
 *
 * First-touch values (landing page, UTMs) are stashed in sessionStorage on
 * first load, because by the time someone reaches Step 3 the URL no longer
 * carries the campaign that brought them in.
 */

const FIRST_TOUCH_KEY = "cl_first_touch";
const SESSION_KEY = "cl_session_id";
const STARTED_KEY = "cl_step1_started";

export interface TrackingPayload {
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent: string;
  utmTerm: string;
  pageUrl: string;
  referrerUrl: string;
  landingPageFirstTouch: string;
  jornayaLeadId: string;
  trustedFormCertUrl: string;
  deviceFingerprint: string;
  sessionId: string;
  step1StartedAt?: string;
  totalTimeOnForm?: number;
  assistedByLoanAgent: string;
}

interface FirstTouch {
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent: string;
  utmTerm: string;
  landingPage: string;
  referrer: string;
  assistedByLoanAgent: string;
}

/**
 * Strips credentials out of a URL before it is recorded.
 *
 * The resume token is a bearer credential. It arrives in the query string, so
 * without this it would be written verbatim into consent evidence, referrer
 * fields and any analytics event — which is exactly the "no sensitive data in
 * logs, emails, URLs or analytics" rule this is here to keep.
 */
const SECRET_PARAMS = ["resume", "token", "auth", "key", "signature", "sig"];

export function sanitizeUrl(raw: string): string {
  if (!raw) return "";
  try {
    const url = new URL(raw, window.location.origin);
    for (const param of SECRET_PARAMS) {
      if (url.searchParams.has(param)) url.searchParams.set(param, "[redacted]");
    }
    return url.toString();
  } catch {
    return raw;
  }
}

/**
 * Removes the resume token from the address bar once it has been used, so it
 * does not linger in browser history or get copied out of the URL bar.
 */
export function scrubResumeTokenFromAddressBar(): void {
  if (typeof window === "undefined") return;
  try {
    const url = new URL(window.location.href);
    if (!url.searchParams.has("resume")) return;
    url.searchParams.delete("resume");
    window.history.replaceState({}, "", url.toString());
  } catch {
    // Nothing to do — the form works regardless.
  }
}

function safeRead(key: string): string | null {
  try {
    return window.sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeWrite(key: string, value: string): void {
  try {
    window.sessionStorage.setItem(key, value);
  } catch {
    // Private browsing or blocked storage — tracking degrades, form still works.
  }
}

/** Captures first-touch attribution once per session. */
export function captureFirstTouch(): void {
  if (typeof window === "undefined") return;
  if (safeRead(FIRST_TOUCH_KEY)) return;

  const params = new URLSearchParams(window.location.search);
  const firstTouch: FirstTouch = {
    utmSource: params.get("utm_source") || "",
    utmMedium: params.get("utm_medium") || "",
    utmCampaign: params.get("utm_campaign") || "",
    utmContent: params.get("utm_content") || "",
    utmTerm: params.get("utm_term") || "",
    landingPage: sanitizeUrl(window.location.href),
    referrer: document.referrer || "",
    assistedByLoanAgent: params.get("agent") || params.get("ref") || "",
  };

  safeWrite(FIRST_TOUCH_KEY, JSON.stringify(firstTouch));
}

function getFirstTouch(): FirstTouch {
  const raw = safeRead(FIRST_TOUCH_KEY);
  if (raw) {
    try {
      return JSON.parse(raw) as FirstTouch;
    } catch {
      // fall through to empty
    }
  }
  return {
    utmSource: "", utmMedium: "", utmCampaign: "", utmContent: "", utmTerm: "",
    landingPage: "", referrer: "", assistedByLoanAgent: "",
  };
}

function getSessionId(): string {
  let id = safeRead(SESSION_KEY);
  if (!id) {
    id = `s_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
    safeWrite(SESSION_KEY, id);
  }
  return id;
}

/** Records when the applicant first landed on Step 1. */
export function markFormStarted(): void {
  if (typeof window === "undefined") return;
  if (!safeRead(STARTED_KEY)) safeWrite(STARTED_KEY, new Date().toISOString());
}

/**
 * A coarse device signal, not a fingerprinting library.
 *
 * Enough to spot the same browser resubmitting; deliberately not enough to
 * track anyone across sites.
 */
function deviceFingerprint(): string {
  if (typeof window === "undefined") return "";

  const parts = [
    navigator.userAgent,
    navigator.language,
    `${screen.width}x${screen.height}x${screen.colorDepth}`,
    new Date().getTimezoneOffset().toString(),
    (navigator.hardwareConcurrency ?? 0).toString(),
  ].join("|");

  // FNV-1a — short, stable, and no dependency.
  let hash = 0x811c9dc5;
  for (let i = 0; i < parts.length; i++) {
    hash ^= parts.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return `fp_${hash.toString(36)}`;
}

/** Reads the Jornaya and TrustedForm certificates the scripts inject. */
function leadCertificates(): { jornayaLeadId: string; trustedFormCertUrl: string } {
  if (typeof document === "undefined") {
    return { jornayaLeadId: "", trustedFormCertUrl: "" };
  }

  const jornaya = document.querySelector<HTMLInputElement>('input[name="universal_leadid"]');
  const trustedForm = document.querySelector<HTMLInputElement>(
    'input[name="xxTrustedFormCertUrl"]',
  );

  return {
    jornayaLeadId: jornaya?.value || "",
    trustedFormCertUrl: trustedForm?.value || "",
  };
}

/** Timezone offset as "-08:00", stored alongside each consent. */
export function timezoneOffset(): string {
  const minutes = -new Date().getTimezoneOffset();
  const sign = minutes >= 0 ? "+" : "-";
  const abs = Math.abs(minutes);
  return `${sign}${String(Math.floor(abs / 60)).padStart(2, "0")}:${String(abs % 60).padStart(2, "0")}`;
}

export function trackingPayload(): TrackingPayload {
  if (typeof window === "undefined") {
    return {
      utmSource: "", utmMedium: "", utmCampaign: "", utmContent: "", utmTerm: "",
      pageUrl: "", referrerUrl: "", landingPageFirstTouch: "",
      jornayaLeadId: "", trustedFormCertUrl: "", deviceFingerprint: "",
      sessionId: "", assistedByLoanAgent: "",
    };
  }

  const first = getFirstTouch();
  const startedAt = safeRead(STARTED_KEY) || undefined;
  const certificates = leadCertificates();

  return {
    utmSource: first.utmSource,
    utmMedium: first.utmMedium,
    utmCampaign: first.utmCampaign,
    utmContent: first.utmContent,
    utmTerm: first.utmTerm,
    pageUrl: sanitizeUrl(window.location.href),
    referrerUrl: sanitizeUrl(first.referrer || document.referrer || ""),
    landingPageFirstTouch: first.landingPage,
    jornayaLeadId: certificates.jornayaLeadId,
    trustedFormCertUrl: certificates.trustedFormCertUrl,
    deviceFingerprint: deviceFingerprint(),
    sessionId: getSessionId(),
    step1StartedAt: startedAt,
    totalTimeOnForm: startedAt
      ? Math.round((Date.now() - new Date(startedAt).getTime()) / 1000)
      : undefined,
    assistedByLoanAgent: first.assistedByLoanAgent,
  };
}
