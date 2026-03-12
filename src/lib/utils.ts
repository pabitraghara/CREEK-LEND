import type { LoanCalculatorResult } from "@/types";

export function calculateLoan(
  amount: number,
  termMonths: number,
  apr: number
): LoanCalculatorResult {
  const monthlyRate = apr / 100 / 12;
  const monthlyPayment =
    (amount * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
    (Math.pow(1 + monthlyRate, termMonths) - 1);
  const totalPayment = monthlyPayment * termMonths;
  const totalInterest = totalPayment - amount;

  return {
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    totalPayment: Math.round(totalPayment * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    apr,
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  if (digits.length === 11 && digits[0] === "1") {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  return phone;
}

export function maskSSN(ssn: string): string {
  const digits = ssn.replace(/\D/g, "");
  if (digits.length === 9) {
    return `***-**-${digits.slice(5)}`;
  }
  return ssn;
}

export function maskAccountNumber(account: string): string {
  if (account.length > 4) {
    return "****" + account.slice(-4);
  }
  return account;
}

export function getUTMParams(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  return {
    utmSource: params.get("utm_source") || "",
    utmMedium: params.get("utm_medium") || "",
    utmCampaign: params.get("utm_campaign") || "",
    utmContent: params.get("utm_content") || "",
  };
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
