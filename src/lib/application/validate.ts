/**
 * Inline validation, run on blur.
 *
 * This mirrors the server's rules so a mistake is caught beside the field
 * rather than after a round trip. It is a convenience, never the gate: the
 * server re-validates everything and is the only thing that decides whether a
 * step is accepted.
 *
 * Per the UX rules: validate on blur, not on submit, and never clear a field
 * on error.
 */

import {
  PURPOSE_REQUIRING_DETAIL,
  requiresEmployerDetails,
  requiresHousingPayment,
  requiresNextPayDate,
} from "./options";
import type { Step1Data, Step2Data, Step3Data } from "./types";

export type Errors = Record<string, string>;

// ---------------------------------------------------------------------------
// Primitives
// ---------------------------------------------------------------------------

const NAME_PATTERN = /^\p{L}[\p{L}\p{M}\s'’.-]*$/u;

export function checkName(value: string, label: string): string | null {
  const v = value.trim();
  if (!v) return `${label} is required`;
  if (v.length < 2) return `${label} must be at least 2 characters`;
  if (v.length > 40) return `${label} must be 40 characters or fewer`;
  if (!NAME_PATTERN.test(v)) {
    return `${label} can only contain letters, spaces, hyphens, apostrophes and periods`;
  }
  return null;
}

const EMAIL_PATTERN =
  /^[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\.)+[A-Za-z]{2,}$/;

const DISPOSABLE = new Set([
  "mailinator.com", "guerrillamail.com", "10minutemail.com", "tempmail.com",
  "temp-mail.org", "yopmail.com", "trashmail.com", "getnada.com", "maildrop.cc",
  "sharklasers.com", "throwawaymail.com", "dispostable.com", "fakeinbox.com",
]);

const DOMAIN_CORRECTIONS: Record<string, string> = {
  "gmai.com": "gmail.com", "gmial.com": "gmail.com", "gmail.co": "gmail.com",
  "gmail.cm": "gmail.com", "gamil.com": "gmail.com", "gmail.con": "gmail.com",
  "gnail.com": "gmail.com", "hotmai.com": "hotmail.com", "hotmial.com": "hotmail.com",
  "hotmail.co": "hotmail.com", "hotmail.con": "hotmail.com", "yaho.com": "yahoo.com",
  "yahooo.com": "yahoo.com", "yahoo.co": "yahoo.com", "yahoo.con": "yahoo.com",
  "outlok.com": "outlook.com", "outlook.co": "outlook.com", "icloud.co": "icloud.com",
  "aol.co": "aol.com", "comcast.com": "comcast.net", "sbcglobal.com": "sbcglobal.net",
};

export function checkEmail(value: string): string | null {
  const v = value.trim().toLowerCase();
  if (!v) return "Email address is required";
  if (!EMAIL_PATTERN.test(v)) return "Please enter a valid email address";
  if (DISPOSABLE.has(v.split("@")[1])) {
    return "Please use a permanent email address so we can reach you about your application.";
  }
  return null;
}

/** Offered as a "did you mean?" prompt — never applied automatically. */
export function emailSuggestion(value: string): string | null {
  const v = value.trim().toLowerCase();
  const [local, domain] = v.split("@");
  if (!local || !domain) return null;
  const corrected = DOMAIN_CORRECTIONS[domain];
  return corrected ? `${local}@${corrected}` : null;
}

const BLOCKED_NPA = new Set(["000", "555", "900", "911", "411", "611", "311", "211", "111"]);

export function checkPhone(value: string, label = "Phone number"): string | null {
  const d = value.replace(/\D/g, "");
  if (!d) return `${label} is required`;
  if (d.length !== 10) return "Please enter a 10-digit US phone number";

  const npa = d.slice(0, 3);
  const nxx = d.slice(3, 6);

  if (BLOCKED_NPA.has(npa)) return "Please enter a valid US phone number";
  if (npa[0] === "0" || npa[0] === "1") return "Please enter a valid US phone number";
  if (npa[1] === "1" && npa[2] === "1") return "Please enter a valid US phone number";
  if (nxx[0] === "0" || nxx[0] === "1") return "Please enter a valid US phone number";
  if (nxx[1] === "1" && nxx[2] === "1") return "Please enter a valid US phone number";
  if (nxx === "555" && d.slice(6, 8) === "01") return "Please enter a valid US phone number";
  if (/^(\d)\1{9}$/.test(d)) return "Please enter a valid US phone number";

  return null;
}

/** Whole years elapsed, with no timezone applied. */
export function ageFrom(iso: string): number | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return null;
  const [y, mo, d] = [+m[1], +m[2], +m[3]];

  const probe = new Date(Date.UTC(y, mo - 1, d));
  if (probe.getUTCFullYear() !== y || probe.getUTCMonth() !== mo - 1 || probe.getUTCDate() !== d) {
    return null;
  }

  const now = new Date();
  let age = now.getFullYear() - y;
  if (now.getMonth() + 1 < mo || (now.getMonth() + 1 === mo && now.getDate() < d)) age -= 1;
  return age;
}

export function checkDateOfBirth(value: string): string | null {
  if (!value) return "Date of birth is required";
  const age = ageFrom(value);
  if (age === null) return "Please enter a valid date";
  if (age < 0) return "Date of birth cannot be in the future";
  if (age < 18) return "You must be at least 18 years old to apply";
  if (age > 100) return "Please check your date of birth";
  return null;
}

function daysFromToday(iso: string): number | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return null;
  const target = Date.UTC(+m[1], +m[2] - 1, +m[3]);
  const now = new Date();
  const base = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((target - base) / 86_400_000);
}

export function checkNextPayDate(value: string): string | null {
  if (!value) return "Next pay date is required";
  const days = daysFromToday(value);
  if (days === null) return "Please enter a valid date";
  if (days <= 0) return "Your next pay date must be in the future";
  if (days > 35) return "Your next pay date should be within the next 35 days";
  return null;
}

export function checkFutureDate(value: string, label: string): string | null {
  if (!value) return `${label} is required`;
  const days = daysFromToday(value);
  if (days === null) return "Please enter a valid date";
  if (days <= 0) return `${label} must be a future date`;
  return null;
}

const PO_BOX_PATTERNS = [
  /\bP[.\s]*O[.\s]*\s*BOX\b/i,
  /\bPOST\s*OFFICE\s*BOX\b/i,
  /\bPOB\s*#?\s*\d/i,
  /^\s*BOX\s+\d+\s*$/i,
  /\bPOSTAL\s*BOX\b/i,
];

export function checkStreetAddress(value: string): string | null {
  const v = value.trim();
  if (!v) return "Street address is required";
  if (v.length < 5) return "Please enter your full street address";
  if (v.length > 100) return "Street address must be 100 characters or fewer";
  if (PO_BOX_PATTERNS.some((p) => p.test(v))) {
    return "Please enter your home street address. We can't use a PO Box as your residence.";
  }
  if (!/\d/.test(v)) return "Please include your house or building number";
  return null;
}

export function checkZip(value: string): string | null {
  const v = value.trim();
  if (!v) return "ZIP code is required";
  if (/^\d{5}-\d{4}$/.test(v)) return "Please enter just the 5-digit ZIP code";
  if (!/^\d{5}$/.test(v)) return "ZIP code must be exactly 5 digits";
  return null;
}

const PUBLICIZED_INVALID_SSN = new Set(["078051120", "219099999", "457555462"]);

export function checkSsn(value: string): string | null {
  const d = value.replace(/\D/g, "");
  if (!d) return "Social Security Number is required";
  if (d.length !== 9) return "Social Security Number must be 9 digits";

  const generic = "Please check your Social Security Number";
  const area = d.slice(0, 3);
  if (area === "000" || area === "666" || parseInt(area, 10) >= 900) return generic;
  if (d.slice(3, 5) === "00") return generic;
  if (d.slice(5) === "0000") return generic;
  if (PUBLICIZED_INVALID_SSN.has(d)) return generic;

  return null;
}

export function checkAbaChecksum(value: string): string | null {
  const d = value.replace(/\D/g, "");
  if (!d) return "Routing number is required";
  if (d.length !== 9) return "Routing number must be exactly 9 digits";

  const n = d.split("").map(Number);
  const sum =
    3 * (n[0] + n[3] + n[6]) + 7 * (n[1] + n[4] + n[7]) + (n[2] + n[5] + n[8]);
  if (sum % 10 !== 0) return "That routing number isn't valid. Please check and re-enter.";

  return null;
}

function checkCurrency(
  raw: string,
  min: number,
  max: number,
  label: string,
  required: boolean,
): string | null {
  const v = raw.replace(/[^0-9]/g, "");
  if (!v) return required ? `${label} is required` : null;

  const n = parseInt(v, 10);
  if (Number.isNaN(n)) return `Please enter ${label.toLowerCase()} as a number`;
  if (n < min) return `${label} must be at least $${min.toLocaleString("en-US")}`;
  if (n > max) return `${label} cannot exceed $${max.toLocaleString("en-US")}`;
  return null;
}

// ---------------------------------------------------------------------------
// Per-step validation
// ---------------------------------------------------------------------------

/** Validates one Step 1 field. Returns null when it is fine. */
export function validateStep1Field(
  field: keyof Step1Data,
  data: Step1Data,
): string | null {
  switch (field) {
    case "loanPurpose":
      return data.loanPurpose ? null : "Please select what the loan is for";
    case "loanPurposeOther":
      if (data.loanPurpose !== PURPOSE_REQUIRING_DETAIL) return null;
      if (data.loanPurposeOther.trim().length < 3) {
        return "Please tell us briefly what the loan is for";
      }
      return data.loanPurposeOther.trim().length > 120
        ? "Please keep this under 120 characters"
        : null;
    case "firstName":
      return checkName(data.firstName, "First name");
    case "lastName":
      return checkName(data.lastName, "Last name");
    case "middleInitial":
      return !data.middleInitial || /^[A-Za-z]$/.test(data.middleInitial)
        ? null
        : "Middle initial must be a single letter";
    case "email":
      return checkEmail(data.email);
    case "confirmEmail":
      if (!data.confirmEmail) return "Please confirm your email address";
      return data.email.trim().toLowerCase() === data.confirmEmail.trim().toLowerCase()
        ? null
        : "Email addresses don't match";
    case "phone":
      return checkPhone(data.phone, "Mobile number");
    case "dateOfBirth":
      return checkDateOfBirth(data.dateOfBirth);
    case "streetAddress":
      return checkStreetAddress(data.streetAddress);
    case "city":
      return data.city.trim().length >= 2 ? null : "City is required";
    case "state":
      return data.state ? null : "Please select your state";
    case "zipCode":
      return checkZip(data.zipCode);
    case "timeAtAddress":
      return data.timeAtAddress ? null : "Please select how long you've lived there";
    case "housingStatus":
      return data.housingStatus ? null : "Please select your housing status";
    case "monthlyHousingPayment":
      return requiresHousingPayment(data.housingStatus)
        ? checkCurrency(data.monthlyHousingPayment, 0, 15000, "Monthly housing payment", true)
        : null;
    case "employmentStatus":
      return data.employmentStatus ? null : "Please select your employment status";
    case "primaryIncomeType":
      return data.primaryIncomeType ? null : "Please select your primary source of income";
    case "employerName":
      if (!requiresEmployerDetails(data.employmentStatus)) return null;
      if (data.employerName.trim().length < 2) return "Employer name is required";
      return data.employerName.trim().length > 60
        ? "Employer name must be 60 characters or fewer"
        : null;
    case "jobTitle":
      if (!requiresEmployerDetails(data.employmentStatus)) return null;
      return data.jobTitle.trim().length >= 2 ? null : "Job title is required";
    case "employerPhone":
      return requiresEmployerDetails(data.employmentStatus)
        ? checkPhone(data.employerPhone, "Employer phone")
        : null;
    case "timeAtJob":
      if (!requiresEmployerDetails(data.employmentStatus)) return null;
      return data.timeAtJob ? null : "Please select how long you've worked there";
    case "netMonthlyIncome":
      return checkCurrency(data.netMonthlyIncome, 500, 50000, "Net monthly income", true);
    case "payFrequency":
      return data.payFrequency ? null : "Please select how often you're paid";
    case "nextPayDate":
      return requiresNextPayDate(data.payFrequency) ? checkNextPayDate(data.nextPayDate) : null;
    case "directDeposit":
      return data.directDeposit ? null : "Please select yes or no";
    case "additionalMonthlyIncome":
      return checkCurrency(data.additionalMonthlyIncome, 0, 20000, "Additional income", false);
    case "additionalIncomeSource": {
      const amount = parseInt(data.additionalMonthlyIncome.replace(/[^0-9]/g, "") || "0", 10);
      if (amount <= 0) return null;
      return data.additionalIncomeSource.trim().length >= 2
        ? null
        : "Please tell us where your additional income comes from";
    }
    default:
      return null;
  }
}

/** The fields Step 1 actually requires, given the conditional rules. */
function step1Fields(data: Step1Data): Array<keyof Step1Data> {
  const fields: Array<keyof Step1Data> = [
    "loanPurpose", "loanPurposeOther", "firstName", "middleInitial", "lastName",
    "email", "confirmEmail", "phone", "dateOfBirth",
    "streetAddress", "city", "state", "zipCode", "timeAtAddress", "housingStatus",
    "employmentStatus", "netMonthlyIncome", "payFrequency", "directDeposit",
    "additionalMonthlyIncome", "additionalIncomeSource",
  ];

  if (requiresHousingPayment(data.housingStatus)) fields.push("monthlyHousingPayment");
  if (requiresEmployerDetails(data.employmentStatus)) {
    fields.push("employerName", "jobTitle", "employerPhone", "timeAtJob");
  }
  if (requiresNextPayDate(data.payFrequency)) fields.push("nextPayDate");

  return fields;
}

export function validateStep1(data: Step1Data, incomeTypeShown: boolean): Errors {
  const errors: Errors = {};
  const fields = step1Fields(data);
  if (incomeTypeShown) fields.push("primaryIncomeType");

  for (const field of fields) {
    const message = validateStep1Field(field, data);
    if (message) errors[field] = message;
  }
  return errors;
}

export function validateStep2(data: Step2Data): Errors {
  const errors: Errors = {};

  const ssn = checkSsn(data.ssn);
  if (ssn) errors.ssn = ssn;
  else if (data.ssn.replace(/\D/g, "") !== data.confirmSsn.replace(/\D/g, "")) {
    errors.confirmSsn = "Social Security Numbers don't match";
  }

  if (!data.driverLicenseNumber.trim()) {
    errors.driverLicenseNumber = "Driver's license number is required";
  } else if (!/^[A-Za-z0-9\s-]{1,20}$/.test(data.driverLicenseNumber)) {
    errors.driverLicenseNumber = "License number must be 1–20 letters or numbers";
  }

  if (!data.driverLicenseState) errors.driverLicenseState = "Please select the issuing state";

  const expiry = checkFutureDate(data.dlExpirationDate, "License expiration date");
  if (expiry) errors.dlExpirationDate = expiry;

  return errors;
}

export function validateStep3(data: Step3Data): Errors {
  const errors: Errors = {};

  const routing = checkAbaChecksum(data.routingNumber);
  if (routing) errors.routingNumber = routing;

  const account = data.accountNumber.replace(/\s/g, "");
  if (!account) errors.accountNumber = "Account number is required";
  else if (!/^\d{4,17}$/.test(account)) errors.accountNumber = "Account number must be 4–17 digits";
  else if (account !== data.confirmAccountNumber.replace(/\s/g, "")) {
    errors.confirmAccountNumber = "Account numbers don't match";
  }

  if (!data.accountType) errors.accountType = "Please select checking or savings";
  if (!data.accountStatus) errors.accountStatus = "Please select your account status";
  if (!data.accountAge) errors.accountAge = "Please select how long you've had this account";

  return errors;
}

// ---------------------------------------------------------------------------
// Input formatting
// ---------------------------------------------------------------------------

export function formatPhoneInput(value: string): string {
  const d = value.replace(/\D/g, "").slice(0, 10);
  if (d.length > 6) return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
  if (d.length > 3) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  if (d.length > 0) return `(${d}`;
  return "";
}

export function formatSsnInput(value: string): string {
  const d = value.replace(/\D/g, "").slice(0, 9);
  if (d.length > 5) return `${d.slice(0, 3)}-${d.slice(3, 5)}-${d.slice(5)}`;
  if (d.length > 3) return `${d.slice(0, 3)}-${d.slice(3)}`;
  return d;
}

/** Thousands separator, applied on blur. Whole dollars, no decimals. */
export function formatCurrencyInput(value: string): string {
  const d = value.replace(/[^0-9]/g, "");
  if (!d) return "";
  return parseInt(d, 10).toLocaleString("en-US");
}

export function parseCurrency(value: string): number {
  const d = value.replace(/[^0-9]/g, "");
  return d ? parseInt(d, 10) : 0;
}
