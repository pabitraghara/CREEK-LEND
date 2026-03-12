"use client";

import { useState } from "react";
import { calculateLoan, formatCurrency } from "@/lib/utils";
import { LOAN_LIMITS } from "@/lib/constants";

export default function LoanCalculator() {
  const [amount, setAmount] = useState(10000);
  const [term, setTerm] = useState(36);
  const [apr, setApr] = useState(12.99);

  const result = calculateLoan(amount, term, apr);

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-surface-dark">
      <h2 className="text-2xl font-bold text-primary mb-6">Loan Calculator</h2>

      {/* Loan Amount */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-text-secondary">
            Loan Amount
          </label>
          <span className="text-lg font-bold text-primary">
            {formatCurrency(amount)}
          </span>
        </div>
        <input
          type="range"
          min={LOAN_LIMITS.minAmount}
          max={LOAN_LIMITS.maxAmount}
          step={500}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full"
          aria-label="Loan amount"
        />
        <div className="flex justify-between text-xs text-text-secondary mt-1">
          <span>{formatCurrency(LOAN_LIMITS.minAmount)}</span>
          <span>{formatCurrency(LOAN_LIMITS.maxAmount)}</span>
        </div>
      </div>

      {/* Loan Term */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-text-secondary">
            Loan Term
          </label>
          <span className="text-lg font-bold text-primary">{term} months</span>
        </div>
        <input
          type="range"
          min={LOAN_LIMITS.minTerm}
          max={LOAN_LIMITS.maxTerm}
          step={12}
          value={term}
          onChange={(e) => setTerm(Number(e.target.value))}
          className="w-full"
          aria-label="Loan term in months"
        />
        <div className="flex justify-between text-xs text-text-secondary mt-1">
          <span>{LOAN_LIMITS.minTerm} mo</span>
          <span>{LOAN_LIMITS.maxTerm} mo</span>
        </div>
      </div>

      {/* APR */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-text-secondary">
            Estimated APR
          </label>
          <span className="text-lg font-bold text-primary">{apr}%</span>
        </div>
        <input
          type="range"
          min={LOAN_LIMITS.minAPR}
          max={LOAN_LIMITS.maxAPR}
          step={0.5}
          value={apr}
          onChange={(e) => setApr(Number(e.target.value))}
          className="w-full"
          aria-label="Annual percentage rate"
        />
        <div className="flex justify-between text-xs text-text-secondary mt-1">
          <span>{LOAN_LIMITS.minAPR}%</span>
          <span>{LOAN_LIMITS.maxAPR}%</span>
        </div>
      </div>

      {/* Results */}
      <div className="bg-surface rounded-xl p-6 space-y-4">
        <div className="text-center">
          <p className="text-sm text-text-secondary">
            Estimated Monthly Payment
          </p>
          <p className="text-4xl font-bold text-primary mt-1">
            {formatCurrency(result.monthlyPayment)}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-surface-dark">
          <div className="text-center">
            <p className="text-xs text-text-secondary">Total Payment</p>
            <p className="text-lg font-semibold text-text-primary">
              {formatCurrency(result.totalPayment)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-text-secondary">Total Interest</p>
            <p className="text-lg font-semibold text-text-primary">
              {formatCurrency(result.totalInterest)}
            </p>
          </div>
        </div>
      </div>

      <p className="text-xs text-text-secondary mt-4 text-center">
        This calculator provides estimates only. Your actual rate and terms may
        vary based on your credit profile.
      </p>
    </div>
  );
}
