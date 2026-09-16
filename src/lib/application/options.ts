/**
 * Option lists for the application form.
 *
 * These mirror `loan-app/src/lib/reference/options.ts`. The server is the
 * authority — it re-validates every value — but the form needs the labels
 * synchronously to render without a loading flash, so the lists live in both
 * places. Any change here needs the same change on the server.
 */

export interface Option {
  value: string;
  label: string;
}

/** Field 2 — fixed order, do not sort. */
export const LOAN_PURPOSES: Option[] = [
  { value: "debt_consolidation", label: "Debt Consolidation" },
  { value: "emergency_expenses", label: "Emergency Expenses" },
  { value: "medical_expenses", label: "Medical Expenses" },
  { value: "dental_expenses", label: "Dental Expenses" },
  { value: "home_improvement", label: "Home Improvement" },
  { value: "auto_repair", label: "Auto Repair" },
  { value: "moving_expenses", label: "Moving Expenses" },
  { value: "wedding_expenses", label: "Wedding Expenses" },
  { value: "vacation", label: "Vacation" },
  { value: "education", label: "Education" },
  { value: "rent_or_utilities", label: "Rent or Utilities" },
  { value: "major_purchase", label: "Major Purchase" },
  { value: "childcare_expenses", label: "Childcare Expenses" },
  { value: "funeral_expenses", label: "Funeral Expenses" },
  { value: "tax_payments", label: "Tax Payments" },
  { value: "business_expenses", label: "Business Expenses" },
  { value: "other_personal_expenses", label: "Other Personal Expenses" },
];

export const PURPOSE_REQUIRING_DETAIL = "other_personal_expenses";

export const NAME_SUFFIXES: Option[] = [
  { value: "", label: "None" },
  { value: "Jr", label: "Jr" },
  { value: "Sr", label: "Sr" },
  { value: "II", label: "II" },
  { value: "III", label: "III" },
  { value: "IV", label: "IV" },
];

export const TIME_AT_ADDRESS: Option[] = [
  { value: "under_6_months", label: "Under 6 months" },
  { value: "6_11_months", label: "6–11 months" },
  { value: "1_2_years", label: "1–2 years" },
  { value: "3_5_years", label: "3–5 years" },
  { value: "5_plus_years", label: "5+ years" },
];

export const HOUSING_STATUSES: Option[] = [
  { value: "rent", label: "Rent" },
  { value: "own_with_mortgage", label: "Own with mortgage" },
  { value: "own_outright", label: "Own outright" },
  { value: "living_with_family", label: "Living with family or friends" },
  { value: "military_housing", label: "Military housing" },
  { value: "other", label: "Other" },
];

/** Field 20 is shown only for these. */
export function requiresHousingPayment(housingStatus: string): boolean {
  return housingStatus === "rent" || housingStatus === "own_with_mortgage";
}

export const EMPLOYMENT_STATUSES: Option[] = [
  { value: "employed_full_time", label: "Employed — Full Time" },
  { value: "employed_part_time", label: "Employed — Part Time" },
  { value: "self_employed", label: "Self-Employed" },
  { value: "active_military", label: "Active Military" },
  { value: "retired", label: "Retired" },
  { value: "disability", label: "Disability" },
  { value: "social_security", label: "Social Security" },
  { value: "unemployment_benefits", label: "Unemployment Benefits" },
  { value: "other_benefits", label: "Other Benefits" },
  { value: "student", label: "Student" },
  { value: "not_employed", label: "Not Currently Employed" },
];

/**
 * Fields 23-26 appear only for applicants who have an employer to name.
 * Everyone else never sees them — do not show fields to someone who can't
 * answer them.
 */
export function requiresEmployerDetails(employmentStatus: string): boolean {
  return [
    "employed_full_time",
    "employed_part_time",
    "self_employed",
    "active_military",
  ].includes(employmentStatus);
}

export const INCOME_TYPES: Option[] = [
  { value: "employment", label: "Employment" },
  { value: "self_employment", label: "Self-Employment" },
  { value: "retirement_pension", label: "Retirement or Pension" },
  { value: "social_security", label: "Social Security" },
  { value: "disability", label: "Disability" },
  { value: "unemployment", label: "Unemployment" },
  { value: "other", label: "Other" },
];

const DERIVED_INCOME_TYPE: Record<string, string> = {
  employed_full_time: "employment",
  employed_part_time: "employment",
  active_military: "employment",
  self_employed: "self_employment",
  retired: "retirement_pension",
  disability: "disability",
  social_security: "social_security",
  unemployment_benefits: "unemployment",
};

/** Field 22 is shown only where the employment status doesn't imply it. */
export function deriveIncomeType(employmentStatus: string): string | null {
  return DERIVED_INCOME_TYPE[employmentStatus] ?? null;
}

export const TIME_AT_JOB: Option[] = [
  { value: "under_3_months", label: "Under 3 months" },
  { value: "3_5_months", label: "3–5 months" },
  { value: "6_11_months", label: "6–11 months" },
  { value: "1_2_years", label: "1–2 years" },
  { value: "3_5_years", label: "3–5 years" },
  { value: "5_plus_years", label: "5+ years" },
];

export const PAY_FREQUENCIES: Option[] = [
  { value: "weekly", label: "Weekly" },
  { value: "biweekly", label: "Every two weeks" },
  { value: "semimonthly", label: "Twice a month" },
  { value: "monthly", label: "Monthly" },
  { value: "irregular", label: "Irregular" },
];

/** Field 29 is required unless pay is irregular. */
export function requiresNextPayDate(payFrequency: string): boolean {
  return payFrequency !== "" && payFrequency !== "irregular";
}

export const ACCOUNT_TYPES: Option[] = [
  { value: "checking", label: "Checking" },
  { value: "savings", label: "Savings" },
];

export const ACCOUNT_STATUSES: Option[] = [
  { value: "positive", label: "Positive" },
  { value: "negative", label: "Negative" },
];

export const ACCOUNT_AGES: Option[] = [
  { value: "under_6_months", label: "Under 6 months" },
  { value: "1_year", label: "1 Year" },
  { value: "2_years", label: "2 Years" },
  { value: "3_years", label: "3 Years" },
  { value: "4_years", label: "4 Years" },
  { value: "5_plus_years", label: "5 Years +" },
];

export const LOAN_TERMS = [12, 24, 36, 48];

export const PRODUCT = {
  minAmount: 2000,
  maxAmount: 10000,
  increment: 500,
  defaultAmount: 5000,
};
