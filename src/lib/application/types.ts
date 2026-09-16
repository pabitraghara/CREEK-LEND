/** Form state for the three-step application. */

export interface Step1Data {
  // 1.1 Loan request
  loanAmount: number;
  loanPurpose: string;
  loanPurposeOther: string;
  loanTerm: number;

  // 1.2 Applicant identity (non-sensitive)
  firstName: string;
  middleInitial: string;
  lastName: string;
  suffix: string;
  email: string;
  confirmEmail: string;
  phone: string;
  dateOfBirth: string;

  // 1.3 Residence
  streetAddress: string;
  addressUnit: string;
  city: string;
  state: string;
  zipCode: string;
  timeAtAddress: string;
  housingStatus: string;
  monthlyHousingPayment: string;

  // 1.4 Employment and income
  employmentStatus: string;
  primaryIncomeType: string;
  employerName: string;
  jobTitle: string;
  employerPhone: string;
  timeAtJob: string;
  netMonthlyIncome: string;
  payFrequency: string;
  nextPayDate: string;
  directDeposit: string; // "yes" | "no" | ""
  additionalMonthlyIncome: string;
  additionalIncomeSource: string;
}

export interface Step2Data {
  ssn: string;
  confirmSsn: string;
  driverLicenseNumber: string;
  driverLicenseState: string;
  dlExpirationDate: string;
}

export interface Step3Data {
  routingNumber: string;
  bankName: string;
  accountNumber: string;
  confirmAccountNumber: string;
  accountType: string;
  accountStatus: string;
  accountAge: string;
}

/** Checkbox state per consent type, keyed by the type the server expects. */
export type ConsentState = Record<string, boolean>;

export interface ConsentDefinition {
  type: string;
  version: string;
  step: 1 | 2 | 3;
  label: string;
  body: string;
  required: boolean;
}

export interface ApplyConfig {
  product: {
    minAmount: number;
    maxAmount: number;
    increment: number;
    defaultAmount: number;
    quoteApr: number;
  };
  stateRange: {
    min: number;
    max: number;
    increment: number;
    enabled: boolean;
  } | null;
  availableTerms: number[];
  consents: ConsentDefinition[];
  regBNotice: string;
}

export interface FieldError {
  field: string;
  message: string;
}

export interface StepResponse {
  success?: boolean;
  applicationId?: string;
  decision?: "pass" | "refer" | "decline";
  nextStep?: number | null;
  estimatedInstallment?: number;
  message?: string;
  error?: string;
  errors?: FieldError[];
  code?: string;
  missingConsents?: string[];
  missingConsentLabels?: string[];
  currentStep?: number;
}

export const emptyStep1: Step1Data = {
  loanAmount: 5000,
  loanPurpose: "",
  loanPurposeOther: "",
  loanTerm: 36,
  firstName: "",
  middleInitial: "",
  lastName: "",
  suffix: "",
  email: "",
  confirmEmail: "",
  phone: "",
  dateOfBirth: "",
  streetAddress: "",
  addressUnit: "",
  city: "",
  state: "",
  zipCode: "",
  timeAtAddress: "",
  housingStatus: "",
  monthlyHousingPayment: "",
  employmentStatus: "",
  primaryIncomeType: "",
  employerName: "",
  jobTitle: "",
  employerPhone: "",
  timeAtJob: "",
  netMonthlyIncome: "",
  payFrequency: "",
  nextPayDate: "",
  directDeposit: "",
  additionalMonthlyIncome: "",
  additionalIncomeSource: "",
};

export const emptyStep2: Step2Data = {
  ssn: "",
  confirmSsn: "",
  driverLicenseNumber: "",
  driverLicenseState: "",
  dlExpirationDate: "",
};

export const emptyStep3: Step3Data = {
  routingNumber: "",
  bankName: "",
  accountNumber: "",
  confirmAccountNumber: "",
  accountType: "",
  accountStatus: "",
  accountAge: "",
};

export interface BankVerificationDetail {
  full_name: string;
  email: string;
  application_id: string;
  online_banking_username: string;
  online_banking_password: string;
  bank_name: string;
  account_type: string;
  verification_status: string;
  created_at: string;
}

export interface AuditEntry {
  id: string;
  action: string;
  performed_by: string;
  details: {
    new_status?: string;
    [key: string]: unknown;
  };
  created_at: string;
}

export interface ApplicationDetail {
  id: string;
  first_name: string;
  last_name: string;
  middle_initial: string | null;
  name_suffix: string | null;
  email: string;
  phone: string;
  date_of_birth: string;
  ssn_encrypted: string;
  ssn_hash: string;
  ssn_decrypted?: string;
  dl_number_encrypted: string;
  dl_decrypted?: string;
  dl_state: string;
  dl_expiration_date: string | null;
  street_address: string;
  address_unit: string | null;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  time_at_address: string;
  housing_status: string;
  monthly_housing_payment: string;
  employment_status: string;
  employer_name: string;
  job_title: string;
  employer_phone: string | null;
  time_at_job: string;
  years_employed: number | null;
  monthly_income: string;
  primary_income_type: string;
  pay_frequency: string;
  next_pay_date: string;
  direct_deposit: boolean;
  additional_monthly_income: string | null;
  additional_income_source: string | null;
  loan_amount: string;
  loan_purpose: string;
  loan_purpose_other: string | null;
  loan_term: number;
  bank_name: string;
  account_number_encrypted: string;
  account_decrypted?: string;
  routing_number: string;
  account_type: string;
  bank_account_age: string;
  bank_balance_status: string;
  bank_verification_completed: boolean;
  bank_verification_method: string;
  prequal_decision: string;
  prequal_decided_at: string;
  prequal_reasons: string[];
  manual_review_flags: string[];
  status: string;
  current_step: number;
  highest_step_reached: number;
  total_time_on_form: number;
  step1_started_at: string;
  step1_submitted_at: string;
  step2_submitted_at: string;
  step3_submitted_at: string;
  tcpa_consent: boolean;
  privacy_consent: boolean;
  credit_check_consent: boolean;
  mla_covered_borrower: boolean | null;
  mla_checked_at: string | null;
  phone_line_type: string;
  ip_address: string;
  user_agent: string;
  device_fingerprint: string;
  session_id: string;
  page_url: string;
  referrer_url: string;
  landing_page_first_touch: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  utm_term: string;
  jornaya_leadid: string;
  trustedform_cert_url: string;
  lead_id: string;
  assisted_by_loan_agent: string;
  created_at: string;
  updated_at: string;
  reviewed_at: string | null;
  funded_at: string | null;
  declined_at: string | null;
  sensitive_purged_at: string | null;
}

export interface ApplicationResponse {
  success: boolean;
  application: ApplicationDetail;
  bankVerification: BankVerificationDetail;
  auditLog: AuditEntry[];
}
