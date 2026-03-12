"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { getUTMParams } from "@/lib/utils";
import { apiUrl } from "@/lib/api";

const StepPersonalInfo = dynamic(() => import("./steps/StepPersonalInfo"));
const StepIdentification = dynamic(() => import("./steps/StepIdentification"));
const StepAddress = dynamic(() => import("./steps/StepAddress"));
const StepEmployment = dynamic(() => import("./steps/StepEmployment"));
const StepLoanDetails = dynamic(() => import("./steps/StepLoanDetails"));
const StepBanking = dynamic(() => import("./steps/StepBanking"));
const StepConsent = dynamic(() => import("./steps/StepConsent"));

export interface ApplicationData {
  // Personal Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  // Identification
  ssn: string;
  driverLicenseNumber: string;
  driverLicenseState: string;
  // Address
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  country: "US" | "CA" | "IN";
  // Employment
  employmentStatus: string;
  employerName: string;
  jobTitle: string;
  monthlyIncome: number;
  yearsEmployed: number;
  // Loan
  loanAmount: number;
  loanPurpose: string;
  loanTerm: number;
  // Banking
  routingNumber: string;
  bankName: string;
  accountNumber: string;
  accountType: "checking" | "savings";
  // Consent
  tcpaConsent: boolean;
  privacyConsent: boolean;
  creditCheckConsent: boolean;
  // UTM
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent: string;
}

const STEPS = [
  { id: 1, title: "Personal Info", shortTitle: "Personal" },
  { id: 2, title: "Identification", shortTitle: "ID" },
  { id: 3, title: "Address", shortTitle: "Address" },
  { id: 4, title: "Employment", shortTitle: "Employment" },
  { id: 5, title: "Loan Details", shortTitle: "Loan" },
  { id: 6, title: "Banking", shortTitle: "Banking" },
  { id: 7, title: "Review & Consent", shortTitle: "Submit" },
];

const initialData: ApplicationData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  ssn: "",
  driverLicenseNumber: "",
  driverLicenseState: "",
  streetAddress: "",
  city: "",
  state: "",
  zipCode: "",
  country: "US",
  employmentStatus: "",
  employerName: "",
  jobTitle: "",
  monthlyIncome: 0,
  yearsEmployed: 0,
  loanAmount: 5000,
  loanPurpose: "",
  loanTerm: 36,
  routingNumber: "",
  bankName: "",
  accountNumber: "",
  accountType: "checking",
  tcpaConsent: false,
  privacyConsent: false,
  creditCheckConsent: false,
  utmSource: "",
  utmMedium: "",
  utmCampaign: "",
  utmContent: "",
};

export default function ApplicationWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ApplicationData>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    message: string;
    applicationId?: string;
  } | null>(null);
  const [geoAllowed, setGeoAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    const utm = getUTMParams();
    setFormData((prev) => ({ ...prev, ...utm }));
  }, []);

  useEffect(() => {
    async function checkGeo() {
      try {
        const res = await fetch(apiUrl("/api/geo-check"));
        const data = await res.json();
        setGeoAllowed(data.allowed);
      } catch {
        setGeoAllowed(true);
      }
    }
    checkGeo();
  }, []);

  useEffect(() => {
    if (currentStep > 1) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentStep]);

  const updateFormData = useCallback((updates: Partial<ApplicationData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  }, []);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch(apiUrl("/api/apply"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setSubmitResult({
          success: true,
          message:
            "Your application has been submitted successfully! We will review your application and contact you within 24 hours.",
          applicationId: data.applicationId,
        });
      } else {
        setSubmitResult({
          success: false,
          message: data.error || "An error occurred. Please try again.",
        });
      }
    } catch {
      setSubmitResult({
        success: false,
        message: "Network error. Please check your connection and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Geo-blocked
  if (geoAllowed === false) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-error"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-text-primary mb-2">
          Service Not Available
        </h2>
        <p className="text-text-secondary">
          Creek Lend is currently available only in the United States, Canada,
          and India. We apologize for the inconvenience.
        </p>
      </div>
    );
  }

  // Success state
  if (submitResult?.success) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-success"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-text-primary mb-2">
          Application Submitted!
        </h2>
        <p className="text-text-secondary">{submitResult.message}</p>

        {submitResult.applicationId && (
          <div className="mt-6 bg-surface rounded-xl p-4">
            <p className="text-sm text-text-secondary mb-1">
              Your Application ID:
            </p>
            <p className="font-mono text-sm font-semibold text-text-primary break-all">
              {submitResult.applicationId}
            </p>
            <p className="text-xs text-text-secondary mt-2">
              Save this ID to check your loan status anytime.
            </p>
          </div>
        )}

        <a
          href="/loan-status"
          className="inline-block mt-6 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 shadow-md hover:shadow-lg"
        >
          Check Loan Status
        </a>
      </div>
    );
  }

  // Loading geo
  if (geoAllowed === null) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-text-secondary">Verifying your location...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Progress Bar */}
      <div className="bg-surface px-6 py-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-text-secondary">
            Step {currentStep} of {STEPS.length}
          </span>
          <span className="text-sm font-medium text-primary">
            {STEPS[currentStep - 1].title}
          </span>
        </div>
        <div className="flex gap-1.5">
          {STEPS.map((step) => (
            <div
              key={step.id}
              className={`h-2 rounded-full flex-1 transition-colors duration-300 ${
                step.id < currentStep
                  ? "bg-success"
                  : step.id === currentStep
                    ? "bg-primary"
                    : "bg-surface-dark"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="p-6 sm:p-8">
        {submitResult && !submitResult.success && (
          <div className="mb-6 bg-error/10 border border-error/20 rounded-lg p-4">
            <p className="text-error text-sm">{submitResult.message}</p>
          </div>
        )}

        {currentStep === 1 && (
          <StepPersonalInfo
            data={formData}
            updateData={updateFormData}
            onNext={nextStep}
          />
        )}
        {currentStep === 2 && (
          <StepIdentification
            data={formData}
            updateData={updateFormData}
            onNext={nextStep}
            onBack={prevStep}
          />
        )}
        {currentStep === 3 && (
          <StepAddress
            data={formData}
            updateData={updateFormData}
            onNext={nextStep}
            onBack={prevStep}
          />
        )}
        {currentStep === 4 && (
          <StepEmployment
            data={formData}
            updateData={updateFormData}
            onNext={nextStep}
            onBack={prevStep}
          />
        )}
        {currentStep === 5 && (
          <StepLoanDetails
            data={formData}
            updateData={updateFormData}
            onNext={nextStep}
            onBack={prevStep}
          />
        )}
        {currentStep === 6 && (
          <StepBanking
            data={formData}
            updateData={updateFormData}
            onNext={nextStep}
            onBack={prevStep}
          />
        )}
        {currentStep === 7 && (
          <StepConsent
            data={formData}
            updateData={updateFormData}
            onBack={prevStep}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        )}
      </div>

      {/* Security Badge */}
      <div className="bg-surface px-6 py-3 border-t border-surface-dark">
        <div className="flex items-center justify-center gap-2 text-xs text-text-secondary">
          <svg
            className="w-4 h-4 text-success"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
              clipRule="evenodd"
            />
          </svg>
          <span>256-bit SSL encrypted &bull; Your data is secure</span>
        </div>
      </div>
    </div>
  );
}
