"use client";

import { useState } from "react";
import Link from "next/link";
import { apiUrl } from "@/lib/api";

interface LoanDetails {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  loan_amount: number;
  loan_purpose: string;
  loan_term: number;
  status: string;
  created_at: string;
  updated_at: string;
  reviewed_at: string | null;
  funded_at: string | null;
}

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bg: string; description: string }
> = {
  pending: {
    label: "Pending Review",
    color: "text-yellow-700",
    bg: "bg-yellow-50 border-yellow-200",
    description:
      "Your application has been received and is waiting to be reviewed by our team.",
  },
  reviewing: {
    label: "Under Review",
    color: "text-blue-700",
    bg: "bg-blue-50 border-blue-200",
    description:
      "Our team is currently reviewing your application. We will contact you if we need additional information.",
  },
  bank_verification_completed: {
    label: " Bank Verification Approved",
    color: "text-green-700",
    bg: "bg-green-50 border-green-200",
    description:
      "Congratulations! Your loan application has been approved. Funds will be disbursed shortly.",
  },
  declined: {
    label: "Declined",
    color: "text-red-700",
    bg: "bg-red-50 border-red-200",
    description:
      "Unfortunately, your application was not approved at this time. Please contact us for more details.",
  },
  funded: {
    label: "Funded",
    color: "text-emerald-700",
    bg: "bg-emerald-50 border-emerald-200",
    description:
      "Your loan has been funded and the amount has been disbursed to your bank account.",
  },
  bank_verification_pending: {
    label: "Pending: Bank Verification",
    color: "text-blue-700",
    bg: "bg-blue-50 border-blue-200",
    description:
      "To finish setting up your account, please verify your bank details. Log in securely using your online banking username and password.",
  },
  pending_bank_verification: {
    label: "Bank Verification Required",
    color: "text-orange-700",
    bg: "bg-orange-50 border-orange-200",
    description:
      "Please complete your bank verification to proceed with your loan application.",
  },
  bank_verification_failed: {
    label: "Bank Verification Failed",
    color: "text-red-700",
    bg: "bg-red-50 border-red-200",
    description:
      "Your bank verification was unsuccessful. Please re-submit your bank details or contact our support team for assistance.",
  },
  bank_verification_in_progress: {
    label: "Bank Verification In Progress",
    color: "text-indigo-700",
    bg: "bg-indigo-50 border-indigo-200",
    description:
      "Your bank verification is currently being processed. Please allow some time for the verification to complete.",
  },
  deposit_in_progress: {
    label: "Verification Deposit In Process",
    description:
      "A micro-deposit has been initiated to your bank account. Please check your bank statement in 1-2 business days for the deposit amounts and come back to verify them.",
    color: "text-yellow-700",
    bg: "bg-yellow-50 border-yellow-200",
  },
};

const PURPOSE_LABELS: Record<string, string> = {
  "debt-consolidation": "Debt Consolidation",
  "home-improvement": "Home Improvement",
  medical: "Medical Expenses",
  auto: "Auto Loan",
  business: "Business",
  education: "Education",
  other: "Other",
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export default function LoanStatusForm() {
  const [applicationId, setApplicationId] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loan, setLoan] = useState<LoanDetails | null>(null);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoan(null);

    if (!applicationId.trim() || !email.trim()) {
      setError("Please enter both your Application ID and email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        apiUrl(
          `/api/application-status?id=${encodeURIComponent(applicationId.trim())}&email=${encodeURIComponent(email.trim())}`,
        ),
      );
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to look up application.");
        return;
      }

      setLoan(data.application);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const statusInfo = loan ? STATUS_CONFIG[loan.status] : null;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Lookup Form */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-surface-dark">
        <form onSubmit={handleLookup} className="space-y-6">
          <div>
            <label
              htmlFor="applicationId"
              className="block text-sm font-semibold text-text-primary mb-2"
            >
              Application ID
            </label>
            <input
              id="applicationId"
              type="text"
              value={applicationId}
              onChange={(e) => setApplicationId(e.target.value)}
              placeholder="e.g. 89876"
              className="w-full px-4 py-3 border border-surface-dark rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
            />
            <p className="mt-1 text-xs text-text-secondary">
              You received this ID when you submitted your application.
            </p>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-text-primary mb-2"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-3 border border-surface-dark rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
            />
            <p className="mt-1 text-xs text-text-secondary">
              The email address you used during your application.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-success hover:bg-success/90 text-white py-3 rounded-lg font-semibold transition-colors duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Looking up..." : "Check Status"}
          </button>
        </form>

        {/* Process Guarantee */}
        <div className="mt-4 bg-surface rounded-lg p-4 border border-surface-dark">
          <p className="text-sm text-text-secondary leading-relaxed">
            <strong className="text-text-primary">Our PST Commitment:</strong>{" "}
            Applications finalized by 2 PM PST are processed for next-day
            funding. Our California team is currently reviewing applications
            from{" "}
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
            .
          </p>
        </div>

        {/* Trust Signal Badges */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-text-secondary">
          <span className="flex items-center gap-1.5">
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
            256-Bit SSL Encrypted Security
          </span>
          <span className="flex items-center gap-1.5">
            <svg
              className="w-4 h-4 text-secondary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 21V3h18v18H3zm4-4h10M7 13h10M7 9h10"
              />
            </svg>
            Proudly Based in Los Angeles, California
          </span>
          <span className="flex items-center gap-1.5">
            <svg
              className="w-4 h-4 text-accent"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Real-Time PST Processing
          </span>
        </div>
      </div>

      {/* Results */}
      {loan && statusInfo && (
        <div className="mt-8 space-y-6">
          {/* Status Banner */}
          <div
            className={`rounded-2xl border-2 p-6 ${statusInfo.bg} text-center`}
          >
            <h2 className={`text-2xl font-bold ${statusInfo.color} mb-2`}>
              {statusInfo.label}
            </h2>
            <p className="text-sm text-text-secondary">
              {statusInfo.description}
            </p>
          </div>

          {/* Bank Verification CTA */}
          {(loan.status === "bank_verification_pending" ||
            loan.status === "pending_bank_verification" ||
            loan.status === "reviewing" ||
            loan.status === "bank_verification_failed") && (
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-surface-dark text-center">
              <h3 className="text-lg font-bold text-text-primary mb-2">
                Complete Bank Verification
              </h3>
              <p className="text-sm text-text-secondary mb-4">
                To finish setting up your account, please verify your bank
                details. Log in securely using your online banking username and
                password.
              </p>
              <a
                href={`/verify-bank?applicationId=${encodeURIComponent(loan.id)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-8 rounded-lg transition-colors shadow-md hover:shadow-lg"
              >
                Verify Your Bank Account
              </a>
            </div>
          )}

          {/* Loan Details Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-surface-dark">
            <h3 className="text-xl font-bold text-text-primary mb-6">
              Loan Details
            </h3>

            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-surface-dark">
                <span className="text-sm text-text-secondary">Applicant</span>
                <span className="font-medium text-text-primary">
                  {loan.first_name} {loan.last_name}
                </span>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-surface-dark">
                <span className="text-sm text-text-secondary">Loan Amount</span>
                <span className="font-bold text-lg text-primary">
                  {formatCurrency(loan.loan_amount)}
                </span>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-surface-dark">
                <span className="text-sm text-text-secondary">
                  Loan Purpose
                </span>
                <span className="font-medium text-text-primary">
                  {PURPOSE_LABELS[loan.loan_purpose] || loan.loan_purpose}
                </span>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-surface-dark">
                <span className="text-sm text-text-secondary">Loan Term</span>
                <span className="font-medium text-text-primary">
                  {loan.loan_term} months
                </span>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-surface-dark">
                <span className="text-sm text-text-secondary">
                  Application Date
                </span>
                <span className="font-medium text-text-primary">
                  {formatDate(loan.created_at)}
                </span>
              </div>

              {loan.reviewed_at && (
                <div className="flex justify-between items-center py-3 border-b border-surface-dark">
                  <span className="text-sm text-text-secondary">
                    Reviewed On
                  </span>
                  <span className="font-medium text-text-primary">
                    {formatDate(loan.reviewed_at)}
                  </span>
                </div>
              )}

              {loan.funded_at && (
                <div className="flex justify-between items-center py-3 border-b border-surface-dark">
                  <span className="text-sm text-text-secondary">Funded On</span>
                  <span className="font-medium text-text-primary">
                    {formatDate(loan.funded_at)}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center py-3">
                <span className="text-sm text-text-secondary">
                  Application ID
                </span>
                <span className="font-mono text-xs text-text-secondary">
                  {loan.id}
                </span>
              </div>
            </div>
          </div>

          {/* Help Section */}
          <div className="bg-surface rounded-xl p-6 text-center">
            <p className="text-sm text-text-secondary">
              Have questions about your application?{" "}
              <Link
                href="/contact"
                className="text-primary hover:text-primary-dark font-medium"
              >
                Contact our support team
              </Link>
            </p>
          </div>
        </div>
      )}

      {/* No results info */}
      {!loan && !error && !loading && (
        <div className="mt-8 bg-surface rounded-xl p-6 text-center">
          <p className="text-sm text-text-secondary">
            Don&apos;t have an Application ID?{" "}
            <Link
              href="/apply"
              className="text-primary hover:text-primary-dark font-medium"
            >
              Apply for a loan
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
