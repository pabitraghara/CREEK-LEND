"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAdminAuth, useAdminApi } from "@/lib/admin-auth";

interface Application {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  country: string;
  loan_amount: number;
  loan_purpose: string;
  loan_term: number;
  monthly_income: number;
  employment_status: string;
  status: string;
  created_at: string;
}

const STATUS_COLORS: Record<string, string> = {
  bank_verification_pending: "bg-yellow-100 text-yellow-800",
  reviewing: "bg-blue-100 text-blue-800",
  bank_verification_completed: "bg-green-100 text-green-800",
  declined: "bg-red-100 text-red-800",
  funded: "bg-purple-100 text-purple-800",
  bank_verification_failed: "bg-red-100 text-red-800",
  bank_verification_in_progress: "bg-indigo-100 text-indigo-800",
};

const STATUSES = [
  "all",
  "bank_verification_pending",
  "reviewing",
  "bank_verification_completed",
  "declined",
  "funded",
  "bank_verification_failed",
  "bank_verification_in_progress",
];
const COUNTRIES = ["all", "US"];

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ApplicationsListPage() {
  const router = useRouter();
  const { user, loading, logout } = useAdminAuth();
  const { adminFetch } = useAdminApi();

  const [applications, setApplications] = useState<Application[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("all");
  const [country, setCountry] = useState("all");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [filterDate, setFilterDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.replace("/admin/login");
  }, [loading, user, router]);

  const fetchApplications = useCallback(async () => {
    if (!user) return;
    setDataLoading(true);

    const params = new URLSearchParams({
      page: String(page),
      limit: "20",
      sortBy,
      sortOrder,
    });
    if (status !== "all") params.set("status", status);
    if (country !== "all") params.set("country", country);
    if (search) params.set("search", search);
    if (!searchInput) {
      if (filterDate) params.set("date", filterDate);
    }

    try {
      const res = await adminFetch(`/api/admin/applications?${params}`);
      const data = await res.json();
      setApplications(data.applications || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Failed to fetch applications:", err);
    } finally {
      setDataLoading(false);
    }
  }, [
    user,
    page,
    status,
    country,
    search,
    filterDate,
    sortBy,
    sortOrder,
    adminFetch,
  ]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput);
  };

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
    setPage(1);
  };

  const SortIcon = ({ field }: { field: string }) => {
    if (sortBy !== field)
      return <span className="text-gray-300 ml-1">&#8597;</span>;
    return (
      <span className="text-primary ml-1">
        {sortOrder === "asc" ? "↑" : "↓"}
      </span>
    );
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Applications{" "}
            <span className="text-gray-400 text-lg font-normal">({total})</span>
          </h1>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              placeholder="Search by name, email, or ID"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none w-64"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary-dark transition cursor-pointer"
            >
              Search
            </button>
          </form>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Status:</span>
            <div className="flex gap-1">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setStatus(s);
                    setPage(1);
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition cursor-pointer ${
                    status === s
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Date:</span>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => {
                setFilterDate(e.target.value);
                setPage(1);
              }}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
            />
            {filterDate !== new Date().toISOString().split("T")[0] && (
              <button
                onClick={() => {
                  setFilterDate(new Date().toISOString().split("T")[0]);
                  setPage(1);
                }}
                className="text-xs text-primary hover:underline cursor-pointer"
              >
                Today
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Country:</span>
            <select
              value={country}
              onChange={(e) => {
                setCountry(e.target.value);
                setPage(1);
              }}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
            >
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>
                  {c === "all" ? "All Countries" : c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {dataLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : applications.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              No applications found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs text-gray-500 uppercase border-b border-gray-100">
                    <th className="px-6 py-3">Applicant ID</th>
                    <th
                      className="px-6 py-3 cursor-pointer select-none"
                      onClick={() => toggleSort("last_name")}
                    >
                      Applicant <SortIcon field="last_name" />
                    </th>
                    <th className="px-6 py-3">Location</th>
                    <th
                      className="px-6 py-3 cursor-pointer select-none"
                      onClick={() => toggleSort("loan_amount")}
                    >
                      Amount <SortIcon field="loan_amount" />
                    </th>
                    <th className="px-6 py-3">Purpose</th>
                    <th
                      className="px-6 py-3 cursor-pointer select-none"
                      onClick={() => toggleSort("monthly_income")}
                    >
                      Income <SortIcon field="monthly_income" />
                    </th>
                    <th className="px-6 py-3">Status</th>
                    <th
                      className="px-6 py-3 cursor-pointer select-none  flex items-center gap-2"
                      onClick={() => toggleSort("created_at")}
                    >
                      Date <SortIcon field="created_at" />
                    </th>
                    <th className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr
                      key={app.id}
                      className="border-b border-gray-50 hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4 font-medium">{app?.id}</td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">
                          {app.first_name} {app.last_name}
                        </div>
                        <div className="text-sm text-gray-500">{app.email}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {app.city}, {app.state} ({app.country})
                      </td>
                      <td className="px-6 py-4 font-medium">
                        {formatCurrency(app.loan_amount)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 capitalize">
                        {app.loan_purpose?.replace(/-/g, " ")}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {formatCurrency(app.monthly_income)}/mo
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[app.status] || ""}`}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDate(app.created_at)}
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/admin/applications/${app.id}`}
                          className="text-primary text-sm hover:underline"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
              <p className="text-sm text-gray-500">
                Page {page} of {totalPages} ({total} total)
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50 transition cursor-pointer"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50 transition cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
