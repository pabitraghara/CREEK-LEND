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
  approved: {
    label: "Approved",
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
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(amount);
}

export default function LoanStatusPage() {
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
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold">
            Check Your Loan Status
          </h1>
          <p className="mt-4 text-lg text-white/80 max-w-2xl mx-auto">
            Enter your Application ID and email address to view the current
            status of your loan application.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-24">
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
                  placeholder="e.g. a1b2c3d4-e5f6-7890-abcd-ef1234567890"
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
                className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-lg font-semibold transition-colors duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Looking up..." : "Check Status"}
              </button>
            </form>
          </div>

          {/* Results */}
          {loan && statusInfo && (
            <div className="mt-8 space-y-6">
              {/* Status Banner */}
              <div
                className={`rounded-2xl border-2 p-6 ${statusInfo.bg} text-center`}
              >
                <p className={`text-2xl font-bold ${statusInfo.color} mb-2`}>
                  {statusInfo.label}
                </p>
                <p className="text-sm text-text-secondary">
                  {statusInfo.description}
                </p>
              </div>

              {/* Loan Details Card */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-surface-dark">
                <h2 className="text-xl font-bold text-text-primary mb-6">
                  Loan Details
                </h2>

                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-surface-dark">
                    <span className="text-sm text-text-secondary">
                      Applicant
                    </span>
                    <span className="font-medium text-text-primary">
                      {loan.first_name} {loan.last_name}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-3 border-b border-surface-dark">
                    <span className="text-sm text-text-secondary">
                      Loan Amount
                    </span>
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
                    <span className="text-sm text-text-secondary">
                      Loan Term
                    </span>
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
                      <span className="text-sm text-text-secondary">
                        Funded On
                      </span>
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
      </section>
    </>
  );
}
