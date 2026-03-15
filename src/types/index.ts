export interface LoanApplication {
  id: string;
  // Personal Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  // Identification
  ssn: string; // Encrypted at rest
  driverLicenseNumber: string; // Encrypted at rest
  driverLicenseState: string;
  // Address
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  country: 'US' | 'CA' | 'IN';
  // Employment
  employmentStatus: string;
  employerName: string;
  jobTitle: string;
  monthlyIncome: number;
  yearsEmployed: number;
  // Loan Details
  loanAmount: number;
  loanPurpose: string;
  loanTerm: number;
  // Banking
  bankName: string;
  accountNumber: string; // Encrypted at rest
  routingNumber: string;
  accountType: 'checking' | 'savings';
  // Tracking
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent: string;
  // Consent
  tcpaConsent: boolean;
  privacyConsent: boolean;
  creditCheckConsent: boolean;
  // Meta
  ipAddress: string;
  userAgent: string;
  leadId: string; // Jornaya/TrustedForm
  createdAt: string;
  status: 'pending' | 'reviewing' | 'approved' | 'declined' | 'bank_verification_failed';
}

export interface FormStep {
  id: number;
  title: string;
  description: string;
}

export interface LoanCalculatorResult {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  apr: number;
}

export interface BankLookupResult {
  bankName: string;
  city: string;
  state: string;
  valid: boolean;
}

export interface GeoCheckResult {
  allowed: boolean;
  country: string;
  region: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface RateInfo {
  state: string;
  minAPR: number;
  maxAPR: number;
  minLoan: number;
  maxLoan: number;
  terms: string;
}
