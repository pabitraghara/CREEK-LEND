"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { apiUrl } from "./api";

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: "admin" | "reviewer" | "viewer";
}

interface AdminAuthContextType {
  user: AdminUser | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
  isReviewer: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("admin_token");
  }, []);

  // Verify stored token on mount
  useEffect(() => {
    const stored = localStorage.getItem("admin_token");
    if (!stored) {
      setLoading(false);
      return;
    }

    fetch(apiUrl("/api/admin/auth"), {
      headers: { Authorization: `Bearer ${stored}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Invalid token");
        return res.json();
      })
      .then((data) => {
        setUser(data.user);
        setToken(stored);
      })
      .catch(() => {
        localStorage.removeItem("admin_token");
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch(apiUrl("/api/admin/auth"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Login failed");

    setUser(data.user);
    setToken(data.token);
    localStorage.setItem("admin_token", data.token);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        isAdmin: user?.role === "admin",
        isReviewer: user?.role === "admin" || user?.role === "reviewer",
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}

// Helper for authenticated API calls
export function useAdminApi() {
  const { token, logout } = useAdminAuth();

  const adminFetch = useCallback(
    async (path: string, options: RequestInit = {}) => {
      const res = await fetch(apiUrl(path), {
        ...options,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          ...options.headers,
        },
      });

      if (res.status === 401) {
        logout();
        throw new Error("Session expired");
      }

      return res;
    },
    [token, logout],
  );

  return { adminFetch };
}
