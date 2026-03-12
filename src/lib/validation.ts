import { z } from "zod";

export const personalInfoSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters")
    .regex(/^[a-zA-Z\s'-]+$/, "First name contains invalid characters"),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters")
    .regex(/^[a-zA-Z\s'-]+$/, "Last name contains invalid characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .min(10, "Please enter a valid phone number")
    .regex(
      /^\+?\d[\d\s().-]{8,}$/,
      "Please enter a valid phone number"
    ),
  dateOfBirth: z.string().refine(
    (dob) => {
      const date = new Date(dob);
      const now = new Date();
      const age = now.getFullYear() - date.getFullYear();
      return age >= 18 && age <= 100;
    },
    { message: "You must be at least 18 years old" }
  ),
});

export const identificationSchema = z.object({
  ssn: z
    .string()
    .min(1, "This field is required")
    .refine(
      (val) =>
        // US SSN: XXX-XX-XXXX
        /^\d{3}-?\d{2}-?\d{4}$/.test(val),
      { message: "Please enter a valid identification number" }
    ),
  driverLicenseNumber: z
    .string()
    .min(4, "Please enter a valid ID number")
    .max(20, "ID number is too long"),
  driverLicenseState: z.string().min(2, "Please select a state"),
});

export const addressSchema = z.object({
  streetAddress: z
    .string()
    .min(5, "Please enter a valid street address")
    .max(100, "Address is too long"),
  city: z
    .string()
    .min(2, "Please enter a valid city")
    .max(50, "City name is too long"),
  state: z.string().min(2, "Please select a state/province"),
  zipCode: z
    .string()
    .regex(
      /^\d{5}(-\d{4})?$/,
      "Please enter a valid ZIP code"
    ),
  country: z.enum(["US"]),
});

export const employmentSchema = z.object({
  employmentStatus: z.enum([
    "employed",
    "self-employed",
    "retired",
    "other",
  ]),
  employerName: z
    .string()
    .min(2, "Please enter your employer's name")
    .max(100, "Employer name is too long"),
  jobTitle: z
    .string()
    .min(2, "Please enter your job title")
    .max(50, "Job title is too long"),
  monthlyIncome: z
    .number()
    .min(500, "Monthly income must be at least $500")
    .max(1000000, "Please enter a valid monthly income"),
  yearsEmployed: z
    .number()
    .min(0, "Years employed cannot be negative")
    .max(50, "Please enter a valid number of years"),
});

export const loanDetailsSchema = z.object({
  loanAmount: z
    .number()
    .min(1000, "Minimum loan amount is $1,000")
    .max(50000, "Maximum loan amount is $50,000"),
  loanPurpose: z.enum([
    "debt-consolidation",
    "home-improvement",
    "medical",
    "auto",
    "business",
    "education",
    "other",
  ]),
  loanTerm: z.number().refine((v) => [12, 24, 36, 48, 60].includes(v), {
    message: "Please select a valid loan term",
  }),
});

export const bankingSchema = z.object({
  routingNumber: z
    .string()
    .min(1, "This field is required")
    .refine(
      (val) => /^\d{9}$/.test(val) || /^[A-Z]{4}0[A-Z0-9]{6}$/i.test(val),
      { message: "Enter a valid 9-digit routing number or 11-character IFSC code" }
    ),
  accountNumber: z
    .string()
    .min(6, "Account number must be at least 6 digits")
    .max(20, "Account number is too long")
    .regex(/^\d+$/, "Account number must contain only digits"),
  accountType: z.enum(["checking", "savings"]),
  bankName: z.string().min(2, "Bank name is required"),
});

export const consentSchema = z.object({
  tcpaConsent: z.literal(true, {
    message: "You must agree to the TCPA consent",
  }),
  privacyConsent: z.literal(true, {
    message: "You must agree to the Privacy Policy",
  }),
  creditCheckConsent: z.literal(true, {
    message: "You must consent to the credit check",
  }),
});

export function extractFieldErrors(error: z.ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (key && typeof key === "string") {
      fieldErrors[key] = issue.message;
    }
  }
  return fieldErrors;
}

export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+=/gi, "")
    .trim();
}
